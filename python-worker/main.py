"""
Module: python-worker/main.py
Description: Main entry point for the Python Monitoring Engine.
"""

import logging
import sys
from config.settings import settings
from worker import start_worker_loop

# הגדרת לוגים תקנית מתוך אובייקט ה-settings
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("main")


def main() -> None:
    """
    Initializes configurations and runs the background monitoring engine.
    """
    logger.info("🟢 Starting Site-Monitor Python Engine...")
    try:
        start_worker_loop(interval_seconds=settings.CHECK_INTERVAL_SECONDS)
    except KeyboardInterrupt:
        logger.info("🛑 Engine stopped gracefully by user.")
    except Exception as fatal_err:
        logger.critical(f"💥 Unhandled engine crash: {fatal_err}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()