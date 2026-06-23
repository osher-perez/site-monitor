from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # אכיפת טיפוסים קשיחה למשתני ה-SMTP
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_FROM_NAME: str

    # טעינה אוטומטית מקובץ ה-.env
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# יצירת מופע (Instance) יחיד של ההגדרות לשימוש בכל חלקי המערכת
settings = Settings()