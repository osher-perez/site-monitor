import os
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI()

# חשוב מאוד לחיבור עם Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# חיבור ל-MongoDB
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
client = MongoClient(MONGO_URI)
db = client.get_database("site_monitor")
sites_collection = db.sites

@app.get("/")
def home():
    return {"status": "Backend is running"}

# בדיקה 2 שלך נכשלה כאן - וודא שהשם הוא בדיוק list-sites
@app.get("/list-sites")
def list_sites():
    sites = list(sites_collection.find({}, {"_id": 0}))
    return sites

@app.get("/check")
def check_site(url: str):
    try:
        response = requests.get(url, timeout=5)
        status = "UP" if response.status_code == 200 else "DOWN"
        
        site_data = {
            "url": url,
            "status": status,
            "last_checked": datetime.utcnow()
        }
        sites_collection.update_one({"url": url}, {"$set": site_data}, upsert=True)
        return {"url": url, "status": status}
    except Exception as e:
        return {"url": url, "status": "ERROR", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)