"""
Module: python-worker/services/email_service.py
Description: Robust email delivery service for critical uptime incidents and resolutions.
"""

import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from jinja2 import Environment, FileSystemLoader, select_autoescape, TemplateNotFound

from config.settings import settings

logger = logging.getLogger(__name__)


class EmailService:
    """
    Handles HTML template rendering and SMTP email dispatch for system notifications.
    """

    def __init__(self) -> None:
        self.host: str = settings.SMTP_HOST
        self.port: int = settings.SMTP_PORT
        self.username: Optional[str] = settings.SMTP_USERNAME
        self.password: Optional[str] = settings.SMTP_PASSWORD
        self.from_email: str = settings.SMTP_FROM_EMAIL
        self.from_name: str = settings.SMTP_FROM_NAME

        # Setting up Jinja2 template engine with strict auto-escaping
        base_dir: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        templates_dir: str = os.path.join(base_dir, "templates")

        self.jinja_env: Environment = Environment(
            loader=FileSystemLoader(templates_dir),
            autoescape=select_autoescape(["html", "xml"])
        )

    def _send_mime_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """
        Internal pipeline to assemble and transmit MIME email over SMTP.
        """
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email

            mime_html = MIMEText(html_content, "html", "utf-8")
            message.attach(mime_html)

            # SMTP network delivery
            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                server.starttls()
                if self.username and self.password:
                    server.login(self.username, self.password)
                server.sendmail(self.from_email, [to_email], message.as_string())

            logger.info(f"📧 Notification email successfully delivered to {to_email}")
            return True

        except smtplib.SMTPException as smtp_err:
            logger.error(f"❌ SMTP protocol error sending email to {to_email}: {type(smtp_err).__name__}")
            return False
        except Exception as err:
            logger.error(f"❌ Unexpected failure in email dispatch pipeline: {type(err).__name__}")
            return False

    def send_critical_alert(self, user_email: str, site_url: str) -> bool:
        """
        Renders and dispatches an incident alert email when a site goes down.
        """
        try:
            subject: str = f"[SiteMonitor] 🚨 Alert: Incident detected on {site_url}"
            template = self.jinja_env.get_template("alert_incident.html")

            html_content: str = template.render(
                site_url=site_url,
                dashboard_url="https://sitemonitor.co.il/dashboard/alerts"
            )

            return self._send_mime_email(to_email=user_email, subject=subject, html_content=html_content)

        except TemplateNotFound:
            logger.error("❌ Email template 'alert_incident.html' was not found in templates directory.")
            return False
        except Exception as err:
            logger.error(f"❌ Failed to render critical alert template: {type(err).__name__}")
            return False

    def send_resolved_alert(self, user_email: str, site_url: str, downtime_duration: str) -> bool:
        """
        Renders and dispatches a resolution email when a site recovers.
        """
        try:
            subject: str = f"[SiteMonitor] ✅ Resolved: {site_url} is operational"
            template = self.jinja_env.get_template("alert_resolved.html")

            html_content: str = template.render(
                site_url=site_url,
                downtime_duration=downtime_duration,
                dashboard_url="https://sitemonitor.co.il/dashboard/alerts"
            )

            return self._send_mime_email(to_email=user_email, subject=subject, html_content=html_content)

        except TemplateNotFound:
            logger.error("❌ Email template 'alert_resolved.html' was not found in templates directory.")
            return False
        except Exception as err:
            logger.error(f"❌ Failed to render resolution template: {type(err).__name__}")
            return False