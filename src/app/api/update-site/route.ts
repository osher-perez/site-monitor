import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { siteId, url } = body;

    if (!siteId || !url) {
      return NextResponse.json(
        { error: "מזהה אתר וכתובת URL חסרים" },
        { status: 400 }
      );
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    const filter: Filter<Document> = ObjectId.isValid(siteId)
      ? { _id: new ObjectId(siteId) }
      : { _id: siteId as unknown as ObjectId };

    const result = await db.collection("sites").updateOne(filter, {
      $set: {
        url: cleanUrl,
        updatedAt: new Date(),
      },
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "האתר לא נמצא לעדכון" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "כתובת האתר עודכנה בהצלחה",
    });
  } catch (error) {
    console.error("Update Site Error:", error);
    return NextResponse.json(
      { error: "שגיאה בעדכון האתר במסד הנתונים" },
      { status: 500 }
    );
  }
}