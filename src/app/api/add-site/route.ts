import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, user_id } = body;

    if (!url || !user_id) {
      return NextResponse.json(
        { error: 'URL and User ID are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('site_monitor');

    // נקה כתובת URL
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const newSite = {
      userId: user_id,
      url: cleanUrl,
      status: 'ONLINE',
      createdAt: new Date(),
      lastChecked: new Date(),
    };

    const result = await db.collection('sites').insertOne(newSite);

    return NextResponse.json({
      success: true,
      message: 'האתר נוסף בהצלחה לניטור',
      siteId: result.insertedId,
    });
  } catch (error) {
    console.error('Add Site Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בשמירת האתר במסד הנתונים' },
      { status: 500 }
    );
  }
}