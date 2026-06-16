import logging
import os
import time
from datetime import datetime, timezone
from pymongo import MongoClient
import requests
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
from pydantic import BaseModel, HttpUrl

# ייבוא הראוטרים של המערכת
from backend import freeScan
from backend.auth import router as auth_router

# הגדרת לוגים מקצועית ומסודרת
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(title="Site Monitor API")

# הגדרת CORS רחבה ומלאה לפיתוח מקומי
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # מאשר ל-Next.js לפנות אלינו
    allow_credentials=True,
    allow_methods=["*"],                      # מאשר את כל סוגי הבקשות
    allow_headers=["*"],                      # מאשר את כל סוגי ה-Headers
)

app.include_router(auth_router)
app.include_router(freeScan.router)

# --- חיבור לבסיס הנתונים MongoDB ---
try:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client.get_database("site_monitor")

    sites_collection = db.sites
    checks_collection = db.checks  # אוסף הבדיקות המרכזי (Logs)

    client.server_info()
    logger.info("✅ Connected to MongoDB successfully (site_monitor)")
except Exception as e:
    logger.error(f"❌ Could not connect to MongoDB: {e}")


# מודל הגדרת נתונים להוספת אתר חדש (Validation)
class SiteCreateInput(BaseModel):
    url: HttpUrl
    user_id: str


# פונקציית עזר לביצוע בדיקת אתר ושמירת התוצאות
def run_and_save_check(site_document):
    url = str(site_document["url"])
    try:
        logger.info(f"🔍 System checking site: {url}")
        start_time = time.time()

        response = requests.get(url, timeout=10)
        response_ms = round((time.time() - start_time) * 1000)
        status = "UP" if response.status_code == 200 else "DOWN"

        site_id = site_document["_id"]
        if isinstance(site_id, str):
            site_id = ObjectId(site_id)

        # ✅ יישור קו: שמירת לוג הבדיקה תחת מפתח אחיד ומקשר site_id
        check_entry = {
            "url": url,
            "site_id": site_id,
            "status": status,
            "response_time_ms": response_ms,
            "timestamp": datetime.now(timezone.utc),
        }
        checks_collection.insert_one(check_entry)

        # עדכון הסטטוס האחרון באוסף sites
        sites_collection.update_one(
            {"_id": site_id},
            {
                "$set": {
                    "status": status,
                    "last_check": datetime.now(timezone.utc),
                }
            },
        )
        logger.info(f"✨ Auto-check completed for {url}: {status} ({response_ms}ms)")

    except Exception as e:
        logger.error(f"💥 Failed checking {url}: {str(e)}")
        try:
            site_id = site_document["_id"]
            if isinstance(site_id, str):
                site_id = ObjectId(site_id)

            sites_collection.update_one(
                {"_id": site_id},
                {
                    "$set": {
                        "status": "DOWN",
                        "last_check": datetime.now(timezone.utc),
                    }
                },
            )
        except Exception as inner_e:
            logger.error(f"❌ Could not update DOWN status in DB: {inner_e}")


# --- משימה אוטומטית: רצה בכל שעה עגולה ---
@app.on_event("startup")
@repeat_every(seconds=3600)
def hourly_monitor_task():
    logger.info("⏰ Hourly monitor task triggered!")
    try:
        all_sites = list(sites_collection.find({}))
        logger.info(f"📋 Found {len(all_sites)} sites to check.")

        for site in all_sites:
            run_and_save_check(site)

    except Exception as e:
        logger.error(f"❌ Error in hourly monitor task: {e}")


# ========================================================
# 🚀 משימה 1: הוספת אנדפוינט חדש, מאובטח ומיושר להוספת אתר
# ========================================================
@app.post("/add-site")
def add_new_site(input_data: SiteCreateInput):
    try:
        target_url = str(input_data.url).rstrip("/")
        user_id_str = input_data.user_id.strip()

        # אבטחת שרת קשיחה: וידוא שלא עוקפים את מכסת ה-3 אתרים של המסלול החינמי
        existing_count = sites_collection.count_documents({"user_id": user_id_str})
        if existing_count >= 3:
            raise HTTPException(
                status_code=400, 
                detail="🚫 לא ניתן להוסיף אתר. הגעת למגבלת המכסה המקסימלית של החשבון (3 אתרים)."
            )

        # מניעת כפילויות: בדיקה האם האתר הזה כבר מנוטר תחת המשתמש הנוכחי
        duplicate_site = sites_collection.find_one({"url": target_url, "user_id": user_id_str})
        if duplicate_site:
            raise HTTPException(status_code=400, detail="⚠️ אתר זה כבר קיים ברשימת הניטור שלך.")

        # יצירת מסמך האתר בפורמט הארכיטקטוני האחיד והחדש
        new_site_doc = {
            "user_id": user_id_str,
            "url": target_url,
            "status": "PENDING",
            "last_check": None,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = sites_collection.insert_one(new_site_doc)
        
        # הרצת בדיקה ראשונית מיידית לאתר החדש כדי שהלקוח לא יראה סטטוס ריק
        new_site_doc["_id"] = result.inserted_id
        run_and_save_check(new_site_doc)

        return {"status": "SUCCESS", "message": "האתר נוסף בהצלחה למערכת הניטור והופעל סריקה ראשונית."}

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in add_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית בהוספת האתר: {str(e)}")


# Route לבדיקת אתר בודד ידנית
@app.get("/check")
def check_site(url: str):
    site = sites_collection.find_one({"url": url})
    if not site:
        return {"status": "ERROR", "message": "Site not found in DB"}
    run_and_save_check(site)
    return {"status": "SUCCESS", "message": f"Checked {url}"}


# ✅ תיקון אחידות: שליפת האתרים לפי השדה האחיד user_id בלבד
@app.get("/list-sites")
def list_sites(user_id: str = None):
    try:
        if not user_id:
            logger.warning("⚠️ list-sites called without user_id parameter")
            return []

        # שליפת האתרים השייכים אך ורק למשתמש הנוכחי (תומך רשמית בפורמט המיושר)
        sites = list(sites_collection.find({"user_id": user_id.strip()}))
        
        for s in sites:
            s["_id"] = str(s["_id"])
            s["user_id"] = str(s["user_id"])
            if "last_check" in s and s["last_check"]:
                s["last_check"] = (
                    s["last_check"].isoformat()
                    if hasattr(s["last_check"], "isoformat")
                    else str(s["last_check"])
                )
        return sites
    except Exception as e:
        logger.error(f"❌ Error in list_sites endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}


# ✅ תיקון אחידות: הצלבת היסטוריה לפי הסטנדרט החדש
@app.get("/site-history")
def get_site_history(url: str, user_id: str):
    try:
        if not url or not user_id:
            raise HTTPException(status_code=400, detail="Missing required parameters")

        # אימות בעלות הרמטי
        site_exists = sites_collection.find_one({"url": url, "user_id": user_id.strip()})

        if not site_exists:
            raise HTTPException(status_code=404, detail="האתר לא נמצא או שאינו משויך לחשבונך")

        # משיכת לוגי הבדיקות המקושרים לאתר
        site_id = site_exists["_id"]
        cursor = checks_collection.find({"site_id": site_id}).sort("timestamp", -1).limit(50)
        history_logs = list(cursor)

        formatted_history = []
        for log in history_logs:
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


# Route מיוחד למנהלים - מחזיר את כל הלקוחות וסיכום סטטוס האתרים שלהם
@app.get("/admin/overview")
def get_admin_overview():
    try:
        users = list(db.users.find({"isAdmin": {"$ne": True}}))
        admin_report = []

        for user in users:
            user_id = user["_id"]
            
            # שליפת האתרים המשויכים למשתמש לפי הפורמט האחיד
            user_sites = list(sites_collection.find({"user_id": str(user_id)}))
            
            up_count = sum(1 for site in user_sites if site.get("status") == "UP")
            down_count = sum(1 for site in user_sites if site.get("status") in ["DOWN", "ERROR"])
            total_sites = len(user_sites)

            admin_report.append({
                "userId": str(user_id),
                "name": user.get("name", "משתמש ללא שם"),
                "email": user.get("email"),
                "phone": user.get("phone", "לא הוזן"),
                "totalSites": total_sites,
                "upSites": up_count,
                "downSites": down_count,
                "createdAt": user.get("createdAt").isoformat() if user.get("createdAt") else None
            })

        logger.info(f"👑 Admin requested overview. Returning {len(admin_report)} customers.")
        return admin_report

    except Exception as e:
        logger.error(f"❌ Error in admin overview endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}
    
    # מודל נתונים לעדכון כתובת האתר (Pydantic Validation)
class SiteUpdateInput(BaseModel):
    old_url: HttpUrl
    new_url: HttpUrl
    user_id: str

# 🗑️ אנדפוינט למחיקת אתר והיסטוריית הבדיקות שלו (Cascade Delete)
@app.delete("/delete-site")
def delete_site(url: str, user_id: str):
    try:
        user_id_str = user_id.strip()
        url_str = url.strip().rstrip("/")

        # וידוא בעלות על האתר לפני ביצוע המחיקה
        site = sites_collection.find_one({"url": url_str, "user_id": user_id_str})
        if not site:
            raise HTTPException(status_code=404, detail="🚫 האתר לא נמצא או שאינו משויך לחשבונך.")

        # 1. מחיקת האתר מאוסף האתרים
        sites_collection.delete_one({"_id": site["_id"]})

        # 2. ניקוי רציף: מחיקת כל הלוגים המשויכים לאתר באוסף checks
        checks_collection.delete_many({"site_id": site["_id"]})

        logger.info(f"🗑️ Site and checks destroyed for: {url_str} by user {user_id_str}")
        return {"status": "SUCCESS", "message": "האתר וכל היסטוריית הלוגים שלו נמחקו לחלוטין מהחשבון."}

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in delete_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית במחיקת האתר: {str(e)}")


# 📝 אנדפוינט לעריכת כתובת ה-URL של האתר ללא אובדן היסטוריה
@app.put("/update-site")
def update_site(input_data: SiteUpdateInput):
    try:
        user_id_str = input_data.user_id.strip()
        old_url_str = str(input_data.old_url).rstrip("/")
        new_url_str = str(input_data.new_url).rstrip("/")

        if old_url_str == new_url_str:
            return {"status": "SUCCESS", "message": "לא בוצע שינוי, כתובת ה-URL זהה."}

        # וידוא בעלות על האתר המיועד לעריכה
        site = sites_collection.find_one({"url": old_url_str, "user_id": user_id_str})
        if not site:
            raise HTTPException(status_code=404, detail="🚫 האתר לעריכה לא נמצא או שאינו משויך לחשבונך.")

        # מניעת כפילויות: וידוא שהכתובת החדשה לא קיימת כבר אצל המשתמש הזה
        duplicate = sites_collection.find_one({"url": new_url_str, "user_id": user_id_str})
        if duplicate:
            raise HTTPException(status_code=400, detail="⚠️ כתובת ה-URL החדשה כבר קיימת ברשימת הניטור שלך.")

        # 1. עדכון כתובת האתר ואתחול הסטטוס ל-PENDING עד לסריקה הבאה
        sites_collection.update_one(
            {"_id": site["_id"]},
            {"$set": {"url": new_url_str, "status": "PENDING", "last_check": None}}
        )

        # 2. עדכון הכתובת בלוגים הישנים לצורך שמירה על רציפות הגרפים
        checks_collection.update_many(
            {"site_id": site["_id"]},
            {"$set": {"url": new_url_str}}
        )

        # הרצת בדיקה ראשונית מיידית לכתובת החדשה
        site["url"] = new_url_str
        run_and_save_check(site)

        logger.info(f"📝 URL updated from {old_url_str} to {new_url_str} by user {user_id_str}")
        return {"status": "SUCCESS", "message": "כתובת האתר עודכנה בהצלחה והופעלה סריקה ראשונית לכתובת החדשה."}

    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        logger.error(f"❌ Error in update_site endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"שגיאה פנימית בעדכון האתר: {str(e)}")
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)