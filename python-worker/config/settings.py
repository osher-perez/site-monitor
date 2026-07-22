"""
Module: python-worker/config/settings.py
Description: Central configuration management using Pydantic Settings.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # MongoDB Settings
    MONGO_URI: str = "mongodb://127.0.0.1:27017"
    DB_NAME: str = "site_monitor"

    # Worker & Execution Settings
    CHECK_INTERVAL_SECONDS: int = 3600
    LOG_LEVEL: str = "INFO"

    # SMTP / Email Notification Settings
    SMTP_HOST: str = "localhost"
    SMTP_PORT: int = 1025
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: str = "noreply@site-monitor.com"
    SMTP_FROM_NAME: str = "Site Monitor"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


# Singleton instance for application-wide settings
settings = Settings()