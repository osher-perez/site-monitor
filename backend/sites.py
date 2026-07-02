import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from bson import ObjectId
from backend.database import sites_collection, checks_collection

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Sites Management"])

class SiteCreateInput(BaseModel):
    url: HttpUrl
    user_id: str

class SiteUpdateInput(BaseModel):
    old_url: HttpUrl
    new_url: HttpUrl
    user_id: str

# פונקציית העזר שיובאה מ-main לצורך שימוש פנימי בראוטים
from backend.utils import run_and_save_check

@router.post("/add-site")
def add_new_site(input_data: SiteCreateInput):
    try:
        target_url = str(input_data.url).rstrip("/")
        user_id_str = input_data.user_id.strip()

        existing_count = sites_collection.count_documents({"user_id": user_id_str})
        if existing_count >= 3:
            raise HTTPException(
                status_code=400, 
                detail="🚫 לא ניתן להוסיף אתר. הגעת למגבלת המכסה המקסימלית של החשבון (3 אתרים)."
            )

        duplicate_site = sites_collection.find_one({"url": target_url, "user_id": user_id_str})
        if duplicate_site:
            raise HTTPException(status_code=400, detail="⚠️ אתר זה כבר קיים ברשימת הניטור שלך.")

        new_site_doc = {
            "user_id": user_id_str,
            "url": target_url,
            "status": "PENDING",
            "last_check": None,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = sites_collection.insert_one(new_site_doc)
        new_site_doc["_id"] = result.inserted_id
        run_and_save_check(new_site_doc)

        return {"status": "SUCCESS", "message": "האתר נוסף בהצלחה למערכת הניטור והופעל סריקה ראשונית."}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in add_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית בהוספת האתר: {str(e)}")

@router.get("/list-sites")
def list_sites(user_id: str = None):
    try:
        if not user_id:
            return []
        sites = list(sites_collection.find({"user_id": user_id.strip()}))
        for s in sites:
            s["_id"] = str(s["_id"])
            s["user_id"] = str(s["user_id"])
            if "last_check" in s and s["last_check"]:
                s["last_check"] = s["last_check"].isoformat() if hasattr(s["last_check"], "isoformat") else str(s["last_check"])
        return sites
    except Exception as e:
        logger.error(f"❌ Error in list_sites endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}

@router.get("/site-history")
def get_site_history(url: str, user_id: str):
    try:
        if not url or not user_id:
            raise HTTPException(status_code=400, detail="Missing required parameters")

        site_exists = sites_collection.find_one({"url": url, "user_id": user_id.strip()})
        if not site_exists:
            raise HTTPException(status_code=404, detail="האתר לא נמצא או שאינו משויך לחשבונך")

        site_id = site_exists["_id"]
        
        # 🛡️ אסטרטגיית מחיקה וסינון אוטומטי (Retention Policy)
        # שולפים רק את 168 הבדיקות האחרונות (היסטוריה של שבוע מלא לפי בדיקה כל שעה)
        cursor = checks_collection.find({"site_id": site_id}).sort("timestamp", -1)
        all_logs = list(cursor)
        
        # לוקחים את ה-168 העדכניים ביותר
        logs_to_keep = all_logs[:168]
        logs_to_delete = all_logs[168:]
        
        # פינוי מקום מיידי בדאטה-בייס: מחיקת הלוגים הישנים שחרגו מהמכסה ההיסטורית
        if logs_to_delete:
            old_ids = [log["_id"] for log in logs_to_delete]
            checks_collection.delete_many({"_id": {"$in": old_ids}})
            logger.info(f"🧹 Cleaned up {len(old_ids)} historical logs from DB for site: {url}")

        formatted_history = []
        for log in logs_to_keep:
            formatted_history.append({
                "status": log.get("status", "UNKNOWN"),
                "response_time": log.get("response_time_ms", 0),
                "timestamp": log.get("timestamp").isoformat() if log.get("timestamp") else None
            })

        return {
            "url": url,
            "status": site_exists.get("status", "PENDING"),
            "last_check": site_exists.get("last_check").isoformat() if site_exists.get("last_check") else None,
            "history": formatted_history
        }
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in site-history endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete-site")
def delete_site(url: str, user_id: str):
    try:
        user_id_str = user_id.strip()
        url_str = url.strip().rstrip("/")
        site = sites_collection.find_one({"url": url_str, "user_id": user_id_str})
        if not site:
            raise HTTPException(status_code=404, detail="🚫 האתר לא נמצא או שאינו משויך לחשבונך.")

        sites_collection.delete_one({"_id": site["_id"]})
        checks_collection.delete_many({"site_id": site["_id"]})
        return {"status": "SUCCESS", "message": "האתר וכל היסטוריית הלוגים שלו נמחקו לחלוטין מהחשבון."}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in delete_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update-site")
def update_site(input_data: SiteUpdateInput):
    try:
        user_id_str = input_data.user_id.strip()
        old_url_str = str(input_data.old_url).rstrip("/")
        new_url_str = str(input_data.new_url).rstrip("/")

        if old_url_str == new_url_str:
            return {"status": "SUCCESS", "message": "לא בוצע שינוי, כתובת ה-URL זהה."}

        site = sites_collection.find_one({"url": old_url_str, "user_id": user_id_str})
        if not site:
            raise HTTPException(status_code=404, detail="🚫 האתר לעריכה לא נמצא או שאינו משויך לחשבונך.")

        duplicate = sites_collection.find_one({"url": new_url_str, "user_id": user_id_str})
        if duplicate:
            raise HTTPException(status_code=400, detail="⚠️ כתובת ה-URL החדשה כבר קיימת ברשימת הניטור שלך.")

        sites_collection.update_one({"_id": site["_id"]}, {"$set": {"url": new_url_str, "status": "PENDING", "last_check": None}})
        checks_collection.update_many({"site_id": site["_id"]}, {"$set": {"url": new_url_str}})
        
        site["url"] = new_url_str
        run_and_save_check(site)
        return {"status": "SUCCESS", "message": "כתובת האתר עודכנה בהצלחה והופעלה סריקה ראשונית לכתובת החדשה."}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in update_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))