from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # אכיפת טיפוסים קשיחה למשתני ה-SMTP עם ערכי ברירת מחדל בטוחים
    SMTP_HOST: Optional[str] = "localhost"
    SMTP_PORT: Optional[int] = 1025
    SMTP_USERNAME: Optional[str] = ""
    SMTP_PASSWORD: Optional[str] = ""
    SMTP_FROM_EMAIL: Optional[str] = "noreply@site-monitor.com"
    SMTP_FROM_NAME: Optional[str] = "Site Monitor"

    # טעינה אוטומטית מקובץ ה-.env (מתעלם ממשתנים חסרים ולא קורס)
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # מתעלם ממשתנים מיותרים בקובץ ה-env
    )

# יצירת מופע (Instance) יחיד של ההגדרות לשימוש בכל חלקי המערכת
settings = Settings()