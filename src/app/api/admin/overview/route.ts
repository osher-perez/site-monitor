import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('site_monitor');

    // שליפת סך הכל משתמשים, אתרים מנוטרים ובדיקות
    const totalUsers = await db.collection('users').countDocuments();
    const totalSites = await db.collection('sites').countDocuments();
    const users = await db.collection('users').find({}).limit(50).toArray();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalSites,
        activeMonitors: totalSites,
      },
      users: users.map(u => ({
        id: u._id.toString(),
        name: u.name || 'ללא שם',
        email: u.email,
        role: u.role || 'customer',
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error('Admin Overview Error:', error);
    return NextResponse.json(
      { error: 'שגיאה שטעינת נתוני מנהל המערכת' },
      { status: 500 }
    );
  }
}