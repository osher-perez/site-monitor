import logging
import socket
import ssl
import time
import traceback
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Query
import requests

# הגדרת לוגר מרכזי לקובץ
logger = logging.getLogger(__name__)

# הגדרת הראוטר עבור הכלים החינמיים הציבוריים
router = APIRouter(prefix="/tools", tags=["Free Tools"])


@router.get("/quick-scan")
def quick_scan(url: str = Query(..., description="הכתובת לבדיקה")):
    try:
        # 1. וידוא קיום פרוטוקול בכתובת ה-URL
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        # 2. חילוץ שם הדומיין (Hostname) בצורה בטוחה
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname

        if not hostname:
            raise HTTPException(status_code=400, detail="כתובת לא תקינה")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        }

        # 3. בדיקת זמינות ומדידת זמן תגובה (verify=False מונע קריסות של אימות מקומי)
        start_time = time.time()
        response = requests.get(
            url, timeout=5, headers=headers, verify=False, allow_redirects=True
        )
        end_time = time.time()

        response_time = round(end_time - start_time, 2)

        # 4. בדיקת תעודת SSL עצמאית מול פורט 443
        ssl_valid = "לא נמצאה תעודה"
        if parsed_url.scheme == "https":
            try:
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE

                with socket.create_connection(
                    (hostname, 443), timeout=3
                ) as sock:
                    with context.wrap_socket(
                        sock, server_hostname=hostname
                    ) as ssock:
                        ssock.getpeercert()
                        ssl_valid = "תקף (Valid)"
            except Exception:
                ssl_valid = "שגיאה / פקעה"

        security_score = "A+" if ssl_valid == "תקף (Valid)" else "F"

        # הגדרת סטטוס חיובי עבור כל קוד תשובה הנמוך מ-400
        is_online = response.status_code < 400

        return {
            "success": True,
            "status": (
                "ONLINE" if is_online else f"ERROR ({response.status_code})"
            ),
            "speed": f"{response_time}s",
            "ssl": ssl_valid,
            "security": security_score,
        }

    except Exception as e:
        logger.error(f"❌ Quick Scan failed for URL {url}: {str(e)}")
        traceback.print_exc()

        return {
            "success": False,
            "status": "OFFLINE",
            "speed": "0.0s",
            "ssl": "שגיאה",
            "security": "F",
        }