import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every

# ייבוא בסיס הנתונים והראוטרים המפוצלים
from backend import freeScan
from backend.auth import router as auth_router
from backend.sites import router as sites_router
from backend.database import sites_collection, db
from backend.utils import run_and_save_check

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# רשימת הדומיינים המורשים (CORS)
origins = [
    "http://localhost:3000",
    "https://site-monitor-five.vercel.app",  # הדומיין הראשי ב-Vercel
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://site-monitor-five.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",  # מאפשר את כל ה-Deployments ב-Vercel
    allow_credentials=False,  # 👈 שונה ל-False עבור ראוטים ציבוריים כמו quick-scan
    allow_methods=["*"],
    allow_headers=["*"],
)

# חיבור כל הראוטרים המבוזרים של האפליקציה
app.include_router(auth_router)
app.include_router(freeScan.router)
app.include_router(sites_router)

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
        
@app.get("/check")
def check_site(url: str):
    # ניקוי לוכסנים ורווחים להתאמה מושלמת לפרונטאנד
    clean_url = url.strip().rstrip("/")
    
    # חיפוש האתר ב-DB
    site = sites_collection.find_one({"url": clean_url})
    if not site:
        return {"status": "ERROR", "message": "האתר לא נמצא במסד הנתונים של המערכת"}
        
    # הרצת הבדיקה המשותפת מ-utils.py
    from backend.utils import run_and_save_check
    run_and_save_check(site)
    
    return {"status": "SUCCESS", "message": f"Checked {clean_url}"}

# הראוט המיוחד של האדמין
@app.get("/admin/overview")
def get_admin_overview():
    try:
        users = list(db.users.find({"isAdmin": {"$ne": True}}))
        admin_report = []
        for user in users:
            user_id = user["_id"]
            user_sites = list(sites_collection.find({"user_id": str(user_id)}))
            up_count = sum(1 for site in user_sites if site.get("status") == "UP")
            down_count = sum(1 for site in user_sites if site.get("status") in ["DOWN", "ERROR"])
            admin_report.append({
                "userId": str(user_id),
                "name": user.get("name", "משתמש ללא שם"),
                "email": user.get("email"),
                "phone": user.get("phone", "לא הוזן"),
                "totalSites": len(user_sites),
                "upSites": up_count,
                "downSites": down_count,
                "createdAt": user.get("createdAt").isoformat() if user.get("createdAt") else None
            })
        return admin_report
    except Exception as e:
        logger.error(f"❌ Error in admin overview endpoint: {e}")
        return {"status": "ERROR", "detail": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)