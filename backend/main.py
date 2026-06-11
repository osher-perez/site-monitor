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
    allow_methods=["*"],                      # מאשר את כל סוגי הבקשות (GET, POST וכו')
    allow_headers=["*"],                      # מאשר את כל סוגי ה-Headers
)

# ריכוז וחיבור הראוטרים של המערכת באזור אחד מוגדר
app.include_router(auth_router)
app.include_router(freeScan.router)

# --- חיבור לבסיס הנתונים MongoDB ---
try:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client.get_database("site_monitor")

    sites_collection = db.sites
    checks_collection = db.checks  # אוסף הבדיקות הרשמי והיחיד

    client.server_info()
    logger.info("✅ Connected to MongoDB successfully (site_monitor)")
except Exception as e:
    logger.error(f"❌ Could not connect to MongoDB: {e}")


# פונקציית עזר לביצוע בדיקת אתר ושמירת התוצאות
def run_and_save_check(site_document):
    url = site_document["url"]
    try:
        logger.info(f"🔍 System checking site: {url}")
        start_time = time.time()

        # ביצוע קריאת ה-HTTP לאתר עם Timeout של 10 שניות
        response = requests.get(url, timeout=10)
        response_ms = round((time.time() - start_time) * 1000)
        status = "UP" if response.status_code == 200 else "DOWN"

        # וידוא שה-ID מומר ל-ObjectId של מונגו
        site_id = site_document["_id"]
        if isinstance(site_id, str):
            site_id = ObjectId(site_id)

        # 1. יצירת לוג בדיקה חדש באוסף checks
        check_entry = {
            "url": url,
            "siteId": site_id,
            "status": status,
            "response_time": response_ms,
            "timestamp": datetime.now(timezone.utc),
        }
        checks_collection.insert_one(check_entry)

        # 2. עדכון הסטטוס האחרון במסמך של האתר באוסף sites
        sites_collection.update_one(
            {"_id": site_id},
            {
                "$set": {
                    "status": status,
                    "lastCheck": datetime.now(timezone.utc),
                }
            },
        )
        logger.info(
            f"✨ Auto-check completed for {url}: {status} ({response_ms}ms)"
        )

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
                        "lastCheck": datetime.now(timezone.utc),
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


# Route לבדיקת אתר בודד ידנית (למשל בלחיצת כפתור מהדשבורד)
@app.get("/check")
def check_site(url: str):
    site = sites_collection.find_one({"url": url})
    if not site:
        return {"status": "ERROR", "message": "Site not found in DB"}
    run_and_save_check(site)
    return {"status": "SUCCESS", "message": f"Checked {url}"}


# ✅ 1. תיקון האנדפוינט המרכזי - הוספת סינון קשיח לפי מזהה המשתמש המבקש
@app.get("/list-sites")
def list_sites(user_id: str = None):
    try:
        if not user_id:
            logger.warning("⚠️ list-sites called without user_id parameter")
            return []

        # המרת הסטרינג ל-ObjectId מוסמך או בדיקה כטקסט נקי בהתאם לאיך ששמרת אותו
        query = {}
        try:
            query = {"$or": [{"userId": ObjectId(user_id)}, {"userId": user_id}, {"user_id": user_id}]}
        except Exception:
            query = {"$or": [{"userId": user_id}, {"user_id": user_id}]}

        # שליפת האתרים השייכים אך ורק למשתמש הנוכחי
        sites = list(sites_collection.find(query))
        
        for s in sites:
            s["_id"] = str(s["_id"])
            if "userId" in s and s["userId"]:
                s["userId"] = str(s["userId"])
            if "user_id" in s and s["user_id"]:
                s["user_id"] = str(s["user_id"])
            if "lastCheck" in s and s["lastCheck"]:
                s["lastCheck"] = (
                    s["lastCheck"].isoformat()
                    if hasattr(s["lastCheck"], "isoformat")
                    else str(s["lastCheck"])
                )
        return sites
    except Exception as e:
        logger.error(f"❌ Error in list_sites endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}


# ✅ 2. הוספת האנדפוינט החסר שגרם לקריסה בעמוד ה-View Site
@app.get("/site-history")
def get_site_history(url: str, user_id: str):
    try:
        if not url or not user_id:
            raise HTTPException(status_code=400, detail="Missing required parameters")

        # אימות בעלות: ודא שהאתר הזה שייך למשתמש שמנסה לחטט בו
        try:
            user_query = {"$or": [{"userId": ObjectId(user_id)}, {"userId": user_id}, {"user_id": user_id}]}
        except Exception:
            user_query = {"$or": [{"userId": user_id}, {"user_id": user_id}]}
            
        site_query = {"url": url, **user_query}
        site_exists = sites_collection.find_one(site_query)

        if not site_exists:
            # אבטחת מידע - אם האתר לא שלו או לא קיים, הוא נחסם
            raise HTTPException(status_code=404, detail="האתר לא נמצא או שאינו משויך לחשבונך")

        # שליפת היסטוריית לוגי הבדיקות מתוך האוסף checks_collection
        # המרת ה-siteId לחיפוש תואם
        site_id = site_exists["_id"]
        cursor = checks_collection.find({"url": url}).sort("timestamp", -1).limit(50)
        history_logs = list(cursor)

        # המרת הטיפוסים לפורמט JSON נקי לטובת Next.js
        formatted_history = []
        for log in history_logs:
            formatted_history.append({
                "status": log.get("status", "UNKNOWN"),
                "response_time": log.get("response_time", 0),
                "timestamp": log.get("timestamp").isoformat() if log.get("timestamp") else None
            })

        return {
            "url": url,
            "status": site_exists.get("status", "PENDING"),
            "lastCheck": site_exists.get("lastCheck").isoformat() if site_exists.get("lastCheck") else None,
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
        # 1. שליפת כל המשתמשים במערכת שאינם אדמינים (כדי שהאדמין לא יראה את עצמו כלקוח)
        users = list(db.users.find({"isAdmin": {"$ne": True}}))
        
        admin_report = []

        for user in users:
            user_id = user["_id"]
            
            # 2. שליפת כל האתרים ששייכים ללקוח הספציפי הזה (תמיכה בשני סוגי המפתחות האפשריים)
            user_sites = list(sites_collection.find({
                "$or": [
                    {"userId": user_id},
                    {"userId": str(user_id)},
                    {"user_id": str(user_id)}
                ]
            }))
            
            # 3. ספירת הסטטוסים (UP מול כל השאר כמו DOWN או PENDING)
            up_count = sum(1 for site in user_sites if site.get("status") == "UP")
            down_count = sum(1 for site in user_sites if site.get("status") in ["DOWN", "ERROR"])
            total_sites = len(user_sites)

            # 4. אריזת הנתונים בצורה נקייה עבור ה-Frontend
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)