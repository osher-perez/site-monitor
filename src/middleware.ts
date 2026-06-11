import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // שליפת העוגיות המאובטחות שהגדרנו ב-Server Actions
  const userId = request.cookies.get("userId")?.value;
  const userRole = request.cookies.get("userRole")?.value; // "admin" או "customer"

  // 1. הגנה על מתחם האדמין (/admin-panel)
  if (pathname.startsWith("/admin-panel")) {
    if (!userId || userRole !== "admin") {
      // אם הוא לא מחובר או שהוא לא אדמין - זורקים אותו לדף ה-Auth הציבורי
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // 2. הגנה על מתחם הלקוח (/dashboard)
  if (pathname.startsWith("/dashboard")) {
    if (!userId) {
      // אם הוא לא מחובר בכלל - זורקים אותו ל-Auth
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    // הערה: אם הוא אדמין, ה-Layout והדפים שלו תומכים ב-viewAs, ולכן מותר לו להיות כאן!
  }

  // 3. הגנה על דף האימות (/auth) - מניעת כניסה כפולה למשתמשים שכבר מחוברים
  if (pathname === "/auth") {
    if (userId) {
      // אם הוא כבר מחובר והוא אדמין - נעביר אותו ישר לפנל הניהול
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin-panel", request.url));
      }
      // אם הוא לקוח רגיל ומחובר - נעביר אותו ישר לדשבורד שלו
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// הגדרת ה-Matcher - על אילו נתיבים ה-Middleware הזה ירוץ אקטיבית
export const config = {
  matcher: ["/dashboard/:path*", "/admin-panel/:path*", "/auth"],
};