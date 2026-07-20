import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// פונקציית ניטור ראשונית בלייב
async function checkSiteHealth(url: string) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 שניות Timeout

    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'SiteMonitor-Bot/1.0' },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    const isUp = res.status >= 200 && res.status < 400;

    return {
      status: isUp ? 'ONLINE' : 'OFFLINE',
      statusCode: res.status,
      responseTime,
      isUp,
    };
  } catch (error) {
    return {
      status: 'OFFLINE',
      statusCode: 0,
      responseTime: Date.now() - startTime,
      isUp: false,
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, user_id } = body;

    if (!url || !user_id) {
      return NextResponse.json(
        { detail: 'נא לספק כתובת אתר ומזהה משתמש' },
        { status: 400 }
      );
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const client = await clientPromise;
    const db = client.db('site_monitor');

    // בדיקה האם האתר כבר מנוטר עבור המשתמש הזה
    const existing = await db.collection('sites').findOne({
      $or: [{ userId: user_id }, { user_id: user_id }],
      url: cleanUrl,
    });

    if (existing) {
      return NextResponse.json(
        { detail: 'אתר זה כבר קיים ברשימת הניטור שלך' },
        { status: 400 }
      );
    }

    // 🚀 מריצים בדיקה ראשונית בלייב!
    const health = await checkSiteHealth(cleanUrl);

    const newSite = {
      userId: user_id,
      user_id: user_id, // שמירה בשני הפורמטים למניעת בעיות תאימות
      url: cleanUrl,
      status: health.status,
      statusCode: health.statusCode,
      responseTime: health.responseTime,
      isUp: health.isUp,
      createdAt: new Date(),
      lastChecked: new Date(),
    };

    const result = await db.collection('sites').insertOne(newSite);

    return NextResponse.json({
      success: true,
      message: 'האתר נוסף בהצלחה ונבדק בלייב',
      siteId: result.insertedId.toString(),
      health,
    });
  } catch (error) {
    console.error('Add Site Error:', error);
    return NextResponse.json(
      { detail: 'שגיאה פנימית בשמירת האתר במסד הנתונים' },
      { status: 500 }
    );
  }
}