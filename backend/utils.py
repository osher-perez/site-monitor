import time
import logging
import requests
from datetime import datetime, timezone
from bson import ObjectId
from backend.database import sites_collection, checks_collection

logger = logging.getLogger(__name__)

def run_and_save_check(site_document):
    url = str(site_document["url"])
    try:
        logger.info(f"🔍 System checking site: {url}")
        start_time = time.time()
        response = requests.get(url, timeout=10)
        response_ms = round((time.time() - start_time) * 1000)
        status = "UP" if response.status_code == 200 else "DOWN"

        site_id = site_document["_id"]
        if isinstance(site_id, str):
            site_id = ObjectId(site_id)

        check_entry = {
            "url": url,
            "site_id": site_id,
            "status": status,
            "response_time_ms": response_ms,
            "timestamp": datetime.now(timezone.utc),
        }
        checks_collection.insert_one(check_entry)

        sites_collection.update_one(
            {"_id": site_id},
            {"$set": {"status": status, "last_check": datetime.now(timezone.utc)}}
        )
        logger.info(f"✨ Auto-check completed for {url}: {status} ({response_ms}ms)")
    except Exception as e:
        logger.error(f"💥 Failed checking {url}: {str(e)}")
        try:
            site_id = site_document["_id"]
            if isinstance(site_id, str):
                site_id = ObjectId(site_id)
            sites_collection.update_one({"_id": site_id}, {"$set": {"status": "DOWN", "last_check": datetime.now(timezone.utc)}})
        except Exception as inner_e:
            logger.error(f"❌ Could not update DOWN status in DB: {inner_e}")