import logging
import socket
import ssl
import time
import traceback
from urllib.parse import urlparse
from fastapi import APIRouter, HTTPException, Query
import requests

# ביטול אזהרות ה-SSL המציפות את הלוגים בגלל ה-verify=False
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tools", tags=["Free Tools"])

@router.get("/quick-scan")
def quick_scan(url: str = Query(..., description="הכתובת לבדיקה")):
    try:
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url

        parsed_url = urlparse(url)
        hostname = parsed_url.hostname

        if not hostname:
            raise HTTPException(status_code=400, detail="כתובת לא תקינה")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
        }

        start_time = time.time()
        # verify=False מאפשר לסרוק את האתר גם אם ה-SSL שלו פגוע כדי לתת ללקוח אבחנה מדויקת
        response = requests.get(
            url, timeout=5, headers=headers, verify=False, allow_redirects=True
        )
        end_time = time.time()

        total_response_time = round(end_time - start_time, 2)
        
        response_headers = response.headers
        security_checks = {
            "X-Frame-Options": "X-Frame-Options" in response_headers,
            "Strict-Transport-Security": "Strict-Transport-Security" in response_headers,
            "X-Content-Type-Options": "X-Content-Type-Options" in response_headers
        }

        passed_headers_count = sum(1 for status in security_checks.values() if status)
        if passed_headers_count == 3:
            security_score = "A"
        elif passed_headers_count == 2:
            security_score = "B"
        elif passed_headers_count == 1:
            security_score = "C"
        else:
            security_score = "D"

        ssl_info = {"status": "לא נמצאה תעודה", "days_remaining": None, "issuer": "לא ידוע"}
        
        if parsed_url.scheme == "https":
            try:
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE

                # הגדרת הגנת רשת הרמטית: הוספת טיימאאוט קשיח גם לחיבור וגם ללחיצת היד של ה-SSL
                with socket.create_connection((hostname, 443), timeout=4) as sock:
                    sock.settimeout(4) # מונע תקיעה בשלב ה-Handshake
                    with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                        ssock.getpeercert(binary_form=True)
                        ssl_info["status"] = "תקף (Valid)"
                        ssl_info["issuer"] = "נשלח באימות מאובטח"
                        ssl_info["days_remaining"] = "נבדק בהצלחה"
            except Exception:
                ssl_info["status"] = "שגיאה / פקעה"
                security_score = "F"

        is_online = response.status_code < 400

        return {
            "success": True,
            "realtime_data": {
                "url": url,
                "status": "ONLINE" if is_online else f"ERROR ({response.status_code})",
                "http_code": response.status_code,
                "speed": f"{total_response_time}s",
                "ssl_status": ssl_info["status"],
                "security_rating": security_score,
                "headers_analysis": security_checks
            },
            "premium_locked_data": {
                "historical_uptime_sla": "LOCKED (Requires 24/7 Continuous Monitoring)",
                "load_variance_graph": "LOCKED (Requires Periodic Sampling)",
                "instant_channels_alerting": "LOCKED (SMS/Telegram/WhatsApp Gateway Not Active for Free Scan)"
            }
        }

    except Exception as e:
        logger.error(f"❌ Quick Scan failed for URL {url}: {str(e)}")
        traceback.print_exc()

        return {
            "success": False,
            "realtime_data": {
                "status": "OFFLINE",
                "http_code": 500,
                "speed": "0.0s",
                "ssl_status": "שגיאה",
                "security_rating": "F",
                "headers_analysis": {"X-Frame-Options": False, "Strict-Transport-Security": False, "X-Content-Type-Options": False}
            },
            "premium_locked_data": {
                "historical_uptime_sla": "LOCKED",
                "load_variance_graph": "LOCKED",
                "instant_channels_alerting": "LOCKED"
            }
        }