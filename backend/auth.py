from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import os
import bcrypt
from datetime import datetime

# הגדרת ראוטר ייעודי למשתמשים - סוג של תת-שרת בתוך השרת המרכזי
router = APIRouter(prefix="/auth", tags=["Authentication"])

# חיבור לבסיס הנתונים (משתמש באותו מונגו)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
client = MongoClient(MONGO_URI)
db = client.get_database("site_monitor")
users_collection = db.users  # אוסף המשתמשים

# מודלים של Pydantic לאימות הנתונים
class EmailCheckRequest(BaseModel):
    email: EmailStr

class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    initialUrl: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

# פונקציות עזר להצפנה ואימות סיסמאות
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# 1. Endpoint לבדיקת קיום מייל במערכת
@router.post("/check-email")
def check_email(data: EmailCheckRequest):
    try:
        email_clean = data.email.strip().lower()
        user_exists = users_collection.find_one({"email": email_clean})
        
        if user_exists:
            return {"exists": True, "message": "User exists, proceed to login."}
        else:
            return {"exists": False, "message": "User does not exist, proceed to registration."}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


# 2. Endpoint להרשמת משתמש חדש
@router.post("/register")
def register_user(data: UserRegisterRequest):
    try:
        email_clean = data.email.strip().lower()
        
        if users_collection.find_one({"email": email_clean}):
            raise HTTPException(status_code=400, detail="Email already registered.")
        
        hashed_pwd = hash_password(data.password)
        
        new_user = {
            "name": data.name.strip(),
            "email": email_clean,
            "phone": data.phone.strip(),
            "password": hashed_pwd,
            "createdAt": datetime.utcnow()
        }
        
        result = users_collection.insert_one(new_user)
        user_id = result.inserted_id
        
        if data.initialUrl:
            db.sites.insert_one({
                "url": data.initialUrl.strip(),
                "status": "PENDING",
                "userId": user_id,
                "createdAt": datetime.utcnow()
            })

        return {
            "success": True, 
            "message": "User registered successfully and initial site added.",
            "userId": str(user_id)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


# 3. Endpoint להתחברות משתמש קיים (Login)
@router.post("/login")
def login_user(data: UserLoginRequest):
    try:
        email_clean = data.email.strip().lower()
        
        user = users_collection.find_one({"email": email_clean})
        if not user:
            raise HTTPException(status_code=400, detail="אימייל או סיסמה שגויים")
            
        if not verify_password(data.password, user["password"]):
            raise HTTPException(status_code=400, detail="אימייל או סיסמה שגויים")
            
        return {
            "success": True,
            "message": "התחברת בהצלחה!",
            "userId": str(user["_id"]),
            "name": user["name"]
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")