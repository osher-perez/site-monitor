import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // מחיקת כל ה-Cookies של האוטוריזציה
  cookieStore.delete('userId');
  cookieStore.delete('userRole');
  cookieStore.delete('userName');

  return NextResponse.json({ success: true, message: 'התנתקת בהצלחה' });
}