import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // הגנה על נתיבי הדשבורד (כל מה שמתחיל ב-/dashboard)
  if (pathname.startsWith('/dashboard')) {
    // שליפת מזהה המשתמש מהקוקיז שנוצרו בזמן הלוגין/הרשמה
    const userIdCookie = request.cookies.get('userId');

    // אם אין מזהה משתמש מחובר - המשתמש לא מורשה! ננתב אותו חזרה לדף הבית
    if (!userIdCookie || !userIdCookie.value) {
      logger_log("🚫 Unauthorized access attempt to dashboard, redirecting to home.");
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // אם הכל תקין, תן לבקשה להמשיך לדף המבוקש
  return NextResponse.next();
}

// הגדרת ה-Matcher אומרת ל-Next.js להריץ את המידלוור *רק* על נתיבי הדשבורד (חוסך ביצועים)
export const config = {
  matcher: ['/dashboard/:path*'],
};

// פונקציית עזר קטנה להדפסה נקייה בטרמינל לפיתוח
function logger_log(message: string) {
  console.log(`[Middleware] ${message}`);
}