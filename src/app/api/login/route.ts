import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json();

  // כאן אנחנו מושכים את הסיסמה מה-.env שלך
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });
    
    // הגדרת ה-Cookie בצורה מאובטחת מהשרת
    response.cookies.set('admin_session', 'true', {
      httpOnly: true, // הגנה מפני גניבת קוקיז ע"י סקריפטים (XSS)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // יום אחד
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}