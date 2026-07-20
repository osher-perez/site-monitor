import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("id") || searchParams.get("siteId");

    if (!siteId) {
      return NextResponse.json(
        { error: "מזהה אתר (siteId) חסר" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    // הגדרת הפילטר עם טיפוס גמיש שמונע שגיאות TypeScript
    const filter: Filter<Document> = ObjectId.isValid(siteId)
      ? { _id: new ObjectId(siteId) }
      : { _id: siteId as unknown as ObjectId };

    const result = await db.collection("sites").deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "האתר לא נמצא במסד הנתונים" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "האתר נמחק בהצלחה",
    });
  } catch (error) {
    console.error("Delete Site Error:", error);
    return NextResponse.json(
      { error: "שגיאה במחיקת האתר מהשרת" },
      { status: 500 }
    );
  }
}