"""
Module: python-worker/core/database.py
Description: Database connection handling and CRUD operations for MongoDB.
"""

import logging
from typing import List, Dict, Any, Optional
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import PyMongoError

from config.settings import settings

logger = logging.getLogger(__name__)

# Primary client instance with safe timeout
_client: Optional[MongoClient] = None


def get_db_client() -> MongoClient:
    """
    Returns a singleton MongoClient instance.
    """
    global _client
    if _client is None:
        _client = MongoClient(
            settings.MONGO_URI,
            serverSelectionTimeoutMS=5000
        )
    return _client


def get_database() -> Database:
    """
    Returns the target database reference.
    """
    client = get_db_client()
    return client.get_database(settings.DB_NAME)


def check_database_connection() -> bool:
    """
    Verifies that the MongoDB instance is reachable without leaking sensitive URIs.
    """
    try:
        client = get_db_client()
        client.server_info()
        logger.info(f"✅ Connected to MongoDB successfully [{settings.DB_NAME}]")
        return True
    except PyMongoError as err:
        logger.error(f"❌ Database connection failed: {type(err).__name__}")
        return False


def get_monitored_sites() -> List[Dict[str, Any]]:
    """
    Fetches all active sites that require monitoring.
    """
    try:
        db = get_database()
        sites_cursor = db.sites.find({})
        return list(sites_cursor)
    except PyMongoError as err:
        logger.error(f"❌ Failed to fetch sites from database: {type(err).__name__}")
        return []


def save_check_result(site_id: str, check_data: Dict[str, Any]) -> bool:
    """
    Persists an inspection check log into the checks collection and updates site status.
    """
    try:
        db = get_database()
        
        # Insert historical check entry
        db.checks.insert_one(check_data)
        
        # Update current status on the main site document
        status: str = check_data.get("status", "UNKNOWN")
        db.sites.update_one(
            {"_id": site_id},
            {"$set": {"status": status, "lastCheckedAt": check_data.get("timestamp")}}
        )
        return True
    except PyMongoError as err:
        logger.error(f"❌ Failed to save check result: {type(err).__name__}")
        return False