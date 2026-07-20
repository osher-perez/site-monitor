import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("id") || searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { error: "מזהה אתר חסר בבקשה" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    // שאילתה גמישה למציאת האתר
    const filter: Filter<Document> = ObjectId.isValid(siteId)
      ? { _id: new ObjectId(siteId) }
      : { _id: siteId as unknown as ObjectId };

    const site = await db.collection("sites").findOne(filter);

    if (!site) {
      return NextResponse.json(
        { error: "האתר לא נמצא במסד הנתונים" },
        { status: 404 }
      );
    }

    // שליפת היסטוריית בדיקות מ-MongoDB אם קיימת, או החזרת נתוני ברירת מחדל
    const history = await db
      .collection("checks")
      .find({ siteId: site._id.toString() })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      success: true,
      site: {
        _id: site._id.toString(),
        id: site._id.toString(),
        url: site.url,
        status: site.status || "ONLINE",
        isUp: site.status === "ONLINE" || site.isUp === true,
        lastChecked: site.lastChecked || site.createdAt || new Date(),
        createdAt: site.createdAt || new Date(),
        responseTime: site.responseTime || 120, // זמן תגובה במילישניות
      },
      history: history.map((check) => ({
        id: check._id.toString(),
        status: check.status || "ONLINE",
        responseTime: check.responseTime || 120,
        timestamp: check.createdAt || new Date(),
      })),
    });
  } catch (error) {
    console.error("Site Details Error:", error);
    return NextResponse.json(
      { error: "לא ניתן היה ליצור קשר עם שרת הניטור או שהנתונים אינם קיימים" },
      { status: 500 }
    );
  }
}