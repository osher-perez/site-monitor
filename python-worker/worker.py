"""
Module: python-worker/worker.py
Description: Handles background monitoring schedules and job execution.
"""

import time
import logging
from typing import Dict, Any, List

from core.database import get_monitored_sites
from checkers.uptime import run_and_save_check

logger = logging.getLogger(__name__)


def execute_hourly_checks() -> None:
    """
    Fetches all monitored sites from the database and triggers an uptime check for each.
    """
    logger.info("⏰ Triggering hourly monitoring task...")
    try:
        sites: List[Dict[str, Any]] = get_monitored_sites()
        logger.info(f"📋 Found {len(sites)} sites to inspect.")

        for site in sites:
            try:
                run_and_save_check(site)
            except Exception as site_err:
                # Catch per-site errors so one failing site does not stop the loop
                site_url: str = site.get("url", "unknown")
                logger.error(f"❌ Failed check for site {site_url}: {site_err}")

        logger.info("✨ Completed monitoring round.")
    except Exception as err:
        logger.error(f"❌ Database or execution error in hourly worker: {err}")


def start_worker_loop(interval_seconds: int = 3600) -> None:
    """
    Runs the continuous background loop.
    
    :param interval_seconds: Sleep time between monitoring iterations (default: 1 hour).
    """
    logger.info(f"🚀 Worker loop started (Interval: {interval_seconds}s)")
    while True:
        execute_hourly_checks()
        time.sleep(interval_seconds)