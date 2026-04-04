import os
import requests
import time
import logging # כלי חדש לניהול שגיאות
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

# הגדרת לוגים - זה ידפיס לנו בטרמינל הודעות ברורות
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# חיבור ל-DB עם הגנת קריסה
try:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    db = client.get_database("site_monitor")
    sites_collection = db.sites
    checks_collection = db.checks
    client.server_info() # בדיקה אם ה-DB באמת מגיב
    logger.info("✅ Connected to MongoDB successfully")
except Exception as e:
    logger.error(f"❌ Could not connect to MongoDB: {e}")

@app.get("/check")
def check_site(url: str):
    try:
        logger.info(f"🔍 Starting check for: {url}")
        start_time = time.time()
        
        # שלב 1: הבקשה לאתר
        response = requests.get(url, timeout=10)
        response_ms = round((time.time() - start_time) * 1000)
        status = "UP" if response.status_code == 200 else "DOWN"
        
        # שלב 2: הכנת הנתונים
        check_entry = {
            "url": url,
            "status": status,
            "response_time": response_ms,
            "timestamp": datetime.utcnow()
        }
        
        # שלב 3: שמירה (כאן לרוב הבעיה)
        logger.info("💾 Attempting to save to DB...")
        checks_collection.insert_one(check_entry)
        sites_collection.update_one(
            {"url": url}, 
            {"$set": {"last_status": status, "last_check": datetime.utcnow()}}, 
            upsert=True
        )

        # שלב 4: ניקוי ה-ID לפני חזרה ל-Frontend
        if "_id" in check_entry:
            check_entry["_id"] = str(check_entry["_id"])

        logger.info(f"✨ Check completed for {url}")
        return check_entry

    except Exception as e:
        logger.error(f"💥 CRITICAL ERROR: {str(e)}")
        return {"status": "ERROR", "message": str(e)}

@app.get("/list-sites")
def list_sites():
    return list(sites_collection.find({}, {"_id": 0}))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)