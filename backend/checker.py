import os
from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from datetime import datetime

# טעינת המשתנים מקובץ ה-.env
load_dotenv()

app = FastAPI()

# חיבור ל-MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database() # ישתמש בשם site_monitor מה-URI
sites_collection = db.sites

@app.get("/add-site")
def add_and_check_site(url: str, name: str = "My Site"):
    # 1. בדיקת הסטטוס (השרירים)
    try:
        response = requests.get(url, timeout=5)
        status = "UP" if response.status_code == 200 else "DOWN"
    except:
        status = "ERROR"

    # 2. שמירה/עדכון ב-Database (הזיכרון)
    site_data = {
        "name": name,
        "url": url,
        "status": status,
        "last_checked": datetime.utcnow()
    }
    
    # עדכון אם ה-URL קיים, או הוספה אם הוא חדש (Upsert)
    sites_collection.update_one({"url": url}, {"$set": site_data}, upsert=True)

    return {"message": "Site added and checked", "data": site_data}

@app.get("/list-sites")
def list_sites():
    # משיכת כל האתרים מה-DB
    sites = list(sites_collection.find({}, {"_id": 0}))
    return sites