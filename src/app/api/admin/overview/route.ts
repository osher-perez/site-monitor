import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('site_monitor');

    const users = await db.collection('users').find({}).toArray();
    const sites = await db.collection('sites').find({}).toArray();

    // בניית הדוח עבור כל לקוח
    const report = users.map((user) => {
      const userIdStr = user._id.toString();
      const userSites = sites.filter(
        (site) => site.userId === userIdStr || site.userId === user.email
      );

      const totalSites = userSites.length;
      const upSites = userSites.filter((s) => s.status === 'ONLINE' || s.isUp || s.is_up).length;
      const downSites = totalSites - upSites;

      return {
        userId: userIdStr,
        name: user.name || 'ללא שם',
        email: user.email || '',
        phone: user.phone || 'לא הוזן',
        totalSites,
        upSites,
        downSites,
        createdAt: user.createdAt || null,
      };
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Admin Overview Error:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת נתוני מנהל מהשרת' },
      { status: 500 }
    );
  }
}