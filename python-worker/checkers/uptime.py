"""
Module: python-worker/checkers/uptime.py
Description: Handles HTTP uptime checks, response timing, and result persistence.
"""

import time
import logging
import requests
from datetime import datetime, timezone
from typing import Dict, Any, Optional

from core.database import save_check_result

logger = logging.getLogger(__name__)

# Standard headers to prevent security blocks on monitoring requests
DEFAULT_HEADERS: Dict[str, str] = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
REQUEST_TIMEOUT_SECONDS: int = 10


def run_and_save_check(site_document: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Executes an HTTP GET request to verify site availability and records the outcome.

    :param site_document: MongoDB site dictionary containing '_id' and 'url'.
    :return: Dictionary containing the check result details, or None if input invalid.
    """
    raw_url: Optional[str] = site_document.get("url")
    site_id: Any = site_document.get("_id")

    if not raw_url or not site_id:
        logger.error("❌ Invalid site document provided: missing 'url' or '_id'")
        return None

    # Sanitize URL format
    url: str = str(raw_url).strip()
    if not (url.startswith("http://") or url.startswith("https://")):
        url = f"https://{url}"

    status: str = "DOWN"
    response_ms: int = 0
    now_utc: datetime = datetime.now(timezone.utc)

    try:
        logger.info(f"🔍 Monitoring check initiated for: {url}")
        start_time: float = time.time()

        response: requests.Response = requests.get(
            url,
            timeout=REQUEST_TIMEOUT_SECONDS,
            headers=DEFAULT_HEADERS,
            allow_redirects=True
        )

        response_ms = round((time.time() - start_time) * 1000)

        # Status HTTP code check (< 400 is considered UP)
        if response.status_code < 400:
            status = "UP"

        logger.info(f"✨ Check finished for {url}: {status} ({response_ms}ms)")

    except requests.RequestException as req_err:
        logger.warning(f"⚠️ Network unreachable for {url}: {type(req_err).__name__}")
    except Exception as err:
        logger.error(f"💥 Unexpected error inspecting {url}: {type(err).__name__}")

    # Build standardized check record
    check_payload: Dict[str, Any] = {
        "url": url,
        "site_id": str(site_id),
        "status": status,
        "response_time_ms": response_ms,
        "timestamp": now_utc
    }

    # Persist results through core database abstraction
    save_check_result(site_id=str(site_id), check_data=check_payload)

    return check_payload