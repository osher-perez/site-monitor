"""
Module: python-worker/checkers/security.py
Description: Performs passive security audits, including SSL validation and Security Headers inspection.
"""

import ssl
import time
import socket
import logging
from urllib.parse import urlparse
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import requests

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS: int = 5
DEFAULT_HEADERS: Dict[str, str] = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}


def evaluate_security_headers(headers: requests.structures.CaseInsensitiveDict) -> Dict[str, Any]:
    """
    Evaluates key Security Headers and calculates a basic Security Rating (A-D).
    """
    checks = {
        "X-Frame-Options": "X-Frame-Options" in headers,
        "Strict-Transport-Security": "Strict-Transport-Security" in headers,
        "X-Content-Type-Options": "X-Content-Type-Options" in headers
    }

    passed_count = sum(1 for is_present in checks.values() if is_present)
    
    score_map = {3: "A", 2: "B", 1: "C", 0: "D"}
    rating = score_map.get(passed_count, "D")

    return {
        "rating": rating,
        "headers_check": checks
    }


def inspect_ssl_certificate(hostname: str) -> Dict[str, Any]:
    """
    Inspects target host SSL certificate validity and remaining expiration days.
    """
    ssl_result = {
        "status": "No Certificate / Failed",
        "days_remaining": None,
        "is_valid": False
    }

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=REQUEST_TIMEOUT_SECONDS) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                if cert and "notAfter" in cert:
                    # Parse certificate expiration date
                    expire_date = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)
                    now_utc = datetime.now(timezone.utc)
                    days_left = (expire_date - now_utc).days

                    ssl_result["status"] = "Valid"
                    ssl_result["days_remaining"] = max(0, days_left)
                    ssl_result["is_valid"] = True
    except Exception as err:
        logger.debug(f"SSL Inspection notice for {hostname}: {type(err).__name__}")

    return ssl_result


def run_security_audit(raw_url: str) -> Dict[str, Any]:
    """
    Main entry point for running a complete passive security scan on a target URL.
    """
    url = raw_url.strip()
    if not (url.startswith("http://") or url.startswith("https://")):
        url = f"https://{url}"

    parsed_url = urlparse(url)
    hostname = parsed_url.hostname

    if not hostname:
        return {"success": False, "error": "Invalid URL or Hostname"}

    start_time = time.time()
    try:
        response = requests.get(
            url,
            timeout=REQUEST_TIMEOUT_SECONDS,
            headers=DEFAULT_HEADERS,
            allow_redirects=True
        )
        total_time_ms = round((time.time() - start_time) * 1000)

        # Header Security Audit
        header_audit = evaluate_security_headers(response.headers)
        
        # SSL Audit (if HTTPS)
        ssl_audit = inspect_ssl_certificate(hostname) if parsed_url.scheme == "https" else {
            "status": "HTTP Only", "days_remaining": None, "is_valid": False
        }

        # Downgrade score if SSL failed on HTTPS
        final_rating = header_audit["rating"]
        if parsed_url.scheme == "https" and not ssl_audit["is_valid"]:
            final_rating = "F"

        return {
            "success": True,
            "url": url,
            "http_status": response.status_code,
            "is_online": response.status_code < 400,
            "response_time_ms": total_time_ms,
            "security_rating": final_rating,
            "headers_analysis": header_audit["headers_check"],
            "ssl_info": ssl_audit
        }

    except requests.RequestException as req_err:
        logger.warning(f"Security audit target unreachable [{url}]: {type(req_err).__name__}")
        return {
            "success": False,
            "url": url,
            "is_online": False,
            "security_rating": "F",
            "error": "Target server unreachable"
        }