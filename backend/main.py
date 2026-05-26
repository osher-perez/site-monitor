import os  
import requests
import time
import logging 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from backend.auth import router as auth_router
from fastapi_utils.tasks import repeat_every 

# הגדרת לוגים
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# הגדרת CORS רחבה ומלאה לפיתוח מקומי
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
# --- חיבור ל-DB תקין ומדויק ---
try:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # השם המדויק מהתמונה!
    db = client.get_database("site_monitor") 
    
    sites_collection = db.sites
    checks_collection = db.checks
    client.server_info() 
    logger.info("✅ Connected to MongoDB successfully (site_monitor)")
except Exception as e:
    logger.error(f"❌ Could not connect to MongoDB: {e}")

# פונקציית עזר לביצוע הבדיקה בפועל ושמירה ל-DB
def run_and_save_check(site_document):
    url = site_document["url"]
    try:
        logger.info(f"🔍 System checking site: {url}")
        start_time = time.time()
        
        response = requests.get(url, timeout=10)
        response_ms = round((time.time() - start_time) * 1000)
        status = "UP" if response.status_code == 200 else "DOWN"
        
        # וידוא שה-ID מומר ל-ObjectId של מונגו לצורך השילוב ב-DB, או נשמר כטקסט נקי
        from bson import ObjectId
        site_id = site_document["_id"]
        if isinstance(site_id, str):
            site_id = ObjectId(site_id)

        # 1. יצירת לוג בדיקה חדש באוסף checks
        check_entry = {
            "url": url,
            "siteId": site_id, # מקשרים את הבדיקה ישירות ל-ID של האתר
            "status": status,
            "response_time": response_ms,
            "timestamp": datetime.utcnow()
        }
        checks_collection.insert_one(check_entry)
        
        # 2. עדכון הסטטוס האחרון במסמך של האתר באוסף sites
        sites_collection.update_one(
            {"_id": site_id}, 
            {"$set": {"status": status, "lastCheck": datetime.utcnow()}}
        )
        logger.info(f"✨ Auto-check completed for {url}: {status} ({response_ms}ms)")
    except Exception as e:
        logger.error(f"💥 Failed checking {url}: {str(e)}")
        try:
            from bson import ObjectId
            site_id = site_document["_id"]
            if isinstance(site_id, str):
                site_id = ObjectId(site_id)
                
            sites_collection.update_one(
                {"_id": site_id}, 
                {"$set": {"status": "DOWN", "lastCheck": datetime.utcnow()}}
            )
        except Exception as inner_e:
            logger.error(f"❌ Could not update DOWN status in DB: {inner_e}")

# --- משימה אוטומטית: רצה בכל שעה עגולה (3600 שניות) ---
@app.on_event("startup")
@repeat_every(seconds=3600) # 3600 שניות = 1 שעה
def hourly_monitor_task():
    logger.info("⏰ Hourly monitor task triggered!")
    try:
        all_sites = list(sites_collection.find({}))
        logger.info(f"📋 Found {len(all_sites)} sites to check.")
        
        for site in all_sites:
            run_and_save_check(site)
            
    except Exception as e:
        logger.error(f"❌ Error in hourly monitor task: {e}")

# ה-Route לבדיקת אתר בודד ידנית
@app.get("/check")
def check_site(url: str):
    site = sites_collection.find_one({"url": url})
    if not site:
        return {"status": "ERROR", "message": "Site not found in DB"}
    run_and_save_check(site)
    return {"status": "SUCCESS", "message": f"Checked {url}"}

# ה-Route המרכזי שמחזיר את הרשימה ל-Next.js
@app.get("/list-sites")
def list_sites():
    try:
        sites = list(sites_collection.find({}))
        for s in sites:
            # המרה קריטית של ה-ID של האתר לטקסט פשוט כדי שלא ישבור את ה-JSON של FastAPI
            s["_id"] = str(s["_id"])
            if "userId" in s and s["userId"]:
                s["userId"] = str(s["userId"])
            if "lastCheck" in s and s["lastCheck"]:
                s["lastCheck"] = s["lastCheck"].isoformat() if hasattr(s["lastCheck"], "isoformat") else str(s["lastCheck"])
        return sites
    except Exception as e:
        logger.error(f"❌ Error in list_sites endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)