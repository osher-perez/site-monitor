import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // הגנה על כל מה שמתחיל ב-/dashboard
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('admin_session');

    // אם אין Cookie של סשן תקין, נשלח אותו חזרה לדף הבית
    if (!session || session.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};