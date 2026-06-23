import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader, select_autoescape

class EmailService:
    def __init__(self):
        # ✅ Lazy Import: מייבאים את settings רק בזמן יצירת האובייקט, אחרי ש-sys.path מעודכן
        from config import settings
        
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.username = settings.SMTP_USERNAME
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.SMTP_FROM_EMAIL
        self.from_name = settings.SMTP_FROM_NAME

        # הגדרת מנוע התבניות של Jinja2 עם הגנת Auto-escaping
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        templates_dir = os.path.join(current_dir, "templates")
        
        self.jinja_env = Environment(
            loader=FileSystemLoader(templates_dir),
            autoescape=select_autoescape(["html", "xml"])
        )

    def _send_mime_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """
        צינור ה-SMTP הפנימי לשילוח ההודעה ברשת.
        """
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            mime_html = MIMEText(html_content, "html", "utf-8")
            message.attach(mime_html)

            with smtplib.SMTP(self.host, self.port) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.sendmail(self.from_email, to_email, message.as_string())
            
            return True
        except Exception as e:
            print(f"[❌ EmailService Error] Failed to dispatch email via SMTP: {str(e)}")
            return False

    def send_critical_alert(self, user_email: str, site_url: str) -> bool:
        """
        קצה קומפוננטה: טעינת תבנית האירוע החריג, הזרקת הנתונים בצורה בטוחה ושילוח.
        """
        try:
            subject = f"[SiteMonitor] 🚨 Alert: Incident detected on {site_url}"
            template = self.jinja_env.get_template("alert_incident.html")
            
            html_content = template.render(
                site_url=site_url,
                dashboard_url="https://sitemonitor.co.il/dashboard/alerts"
            )
            
            return self._send_mime_email(to_email=user_email, subject=subject, html_content=html_content)
        except Exception as e:
            print(f"[❌ EmailService Template Error] Render failed: {str(e)}")
            return False

    def send_resolved_alert(self, user_email: str, site_url: str, downtime_duration: str) -> bool:
        """
        קצה קומפוננטה: טעינת תבנית החזרה לשגרה, הזרקת המדדים בצורה בטוחה ושילוח.
        """
        try:
            subject = f"[SiteMonitor] ✅ Resolved: {site_url} is operational"
            template = self.jinja_env.get_template("alert_resolved.html")
            
            html_content = template.render(
                site_url=site_url,
                downtime_duration=downtime_duration,
                dashboard_url="https://sitemonitor.co.il/dashboard/alerts"
            )
            
            return self._send_mime_email(to_email=user_email, subject=subject, html_content=html_content)
        except Exception as e:
            print(f"[❌ EmailService Template Error] Resolved render failed: {str(e)}")
            return False


# ==========================================
# 🧪 בלוק בדיקה מקומי זמני
# ==========================================
if __name__ == "__main__":
    import sys
    
    # עדכון נתיב האב (backend) לתוך ה-sys.path לפני אתחול ה-Singleton
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
    
    # יצירת המופע רק עכשיו - כשהנתיבים מסודרים לחלוטין
    email_service = EmailService()

    # 🎯 הזן כאן את תיבת המייל האישית שלך לקבלת הבדיקה
    TEST_RECEIVER_EMAIL = "your-personal-email@example.com"
    TEST_SITE_URL = "test-e-commerce-shop.co.il"
    
    print("\n🚀 [Test] Starting SMTP Alert Engine integration check...")
    
    # 🔴 בדיקה 1: שליחת התראת קריסה קריטית
    print("⏳ Dispatching Critical Alert Template...")
    critical_success = email_service.send_critical_alert(
        user_email=TEST_RECEIVER_EMAIL, 
        site_url=TEST_SITE_URL
    )
    
    if critical_success:
        print("?? Critical Alert sent successfully! Check your inbox.")
    else:
        print("❌ Critical Alert dispatch failed. Inspect logs above.")
        
    print("-" * 50)
    
    # 🟢 בדיקה 2: שליחת התראת חזרה לשגרה
    print("⏳ Dispatching Resolved Alert Template...")
    resolved_success = email_service.send_resolved_alert(
        user_email=TEST_RECEIVER_EMAIL, 
        site_url=TEST_SITE_URL, 
        downtime_duration="4 דקות ו-12 שניות"
    )
    
    if resolved_success:
        print("✅ Resolved Alert sent successfully! Check your inbox.")
    else:
        print("❌ Resolved Alert dispatch failed. Inspect logs above.")
        
    print("\n🏁 [Test] Integration check finished.")