import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id") || searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing user_id parameter" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    // בנית שאילתה גמישה: תומך בחיפוש לפי string וגם לפי ObjectId אם מדובר ב-ID חוקי
    const queryConditions: any[] = [{ userId: userId }, { user_id: userId }];

    if (ObjectId.isValid(userId)) {
      queryConditions.push({ userId: new ObjectId(userId) });
      queryConditions.push({ user_id: new ObjectId(userId) });
    }

    const sites = await db
      .collection("sites")
      .find({ $or: queryConditions })
      .toArray();

    // נרמל את התשובה לפורמט אחיד
    const formattedSites = sites.map((site) => ({
      _id: site._id.toString(),
      id: site._id.toString(),
      url: site.url,
      status: site.status || "ONLINE",
      isUp: site.status === "ONLINE" || site.isUp === true || site.is_up === true,
      lastChecked: site.lastChecked || site.createdAt || new Date(),
      createdAt: site.createdAt || new Date(),
    }));

    return NextResponse.json(formattedSites);
  } catch (error) {
    console.error("List Sites Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites from database" },
      { status: 500 }
    );
  }
}