import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") || searchParams.get("userId");

    if (!userId) {
      // החזרת מערך ריק במקום אובייקט שגיאה מונעת קריסות client ב-data.length או data.map
      return NextResponse.json([]);
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    // הגדרת מערך תנאים טיפוסים קשיח ללא any
    const queryConditions: Filter<Document>[] = [
      { userId: userId },
      { user_id: userId },
    ];

    if (ObjectId.isValid(userId)) {
      queryConditions.push({ userId: new ObjectId(userId) });
      queryConditions.push({ user_id: new ObjectId(userId) });
    }

    const sites = await db
      .collection("sites")
      .find({ $or: queryConditions })
      .toArray();

    const formattedSites = sites.map((site) => {
      const siteId = site._id.toString();
      const isUp = site.status === "ONLINE" || site.isUp === true || site.is_up === true;

      return {
        _id: siteId,
        id: siteId,
        url: site.url,
        status: site.status || (isUp ? "ONLINE" : "OFFLINE"),
        statusCode: site.statusCode || 200,
        responseTime: site.responseTime || 120,
        isUp,
        lastChecked: site.lastChecked || site.createdAt || new Date(),
        last_checked: site.lastChecked || site.createdAt || new Date(),
        createdAt: site.createdAt || new Date(),
      };
    });

    return NextResponse.json(formattedSites);
  } catch (error) {
    console.error("List Sites Error:", error);
    return NextResponse.json([]);
  }
}