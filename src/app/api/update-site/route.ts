import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { old_url, new_url, site_id, user_id } = body;

    if ((!old_url && !site_id) || !new_url || !user_id) {
      return NextResponse.json(
        { detail: "חסרים נתונים חיוניים לעדכון הכתובת" },
        { status: 400 }
      );
    }

    // 🧼 ניקוי יסודי של הכתובת החדשה
    let cleanNewUrl = new_url.trim().replace(/^\/+/, "");
    if (!cleanNewUrl.startsWith("http://") && !cleanNewUrl.startsWith("https://")) {
      cleanNewUrl = `https://${cleanNewUrl}`;
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    const queryConditions: Filter<Document>[] = [];

    if (site_id && ObjectId.isValid(site_id)) {
      queryConditions.push({ _id: new ObjectId(site_id) });
    }

    if (old_url) {
      const cleanOld = old_url.trim();
      const normalizedOld = cleanOld.replace(/^\/+/, "");
      queryConditions.push({ url: cleanOld });
      queryConditions.push({ url: normalizedOld });
      queryConditions.push({ url: `https://${normalizedOld}` });
    }

    const userConditions: Filter<Document>[] = [
      { userId: user_id },
      { user_id: user_id },
    ];
    if (ObjectId.isValid(user_id)) {
      userConditions.push({ userId: new ObjectId(user_id) });
      userConditions.push({ user_id: new ObjectId(user_id) });
    }

    const finalQuery = {
      $and: [
        { $or: queryConditions },
        { $or: userConditions },
      ],
    };

    const updateResult = await db.collection("sites").updateOne(finalQuery, {
      $set: {
        url: cleanNewUrl,
        lastChecked: new Date(),
      },
    });

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { detail: "האתר לעדכון לא נמצא במסד הנתונים" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "כתובת ה-URL עודכנה בהצלחה",
      updatedUrl: cleanNewUrl,
    });
  } catch (error) {
    console.error("Update Site Error:", error);
    return NextResponse.json(
      { detail: "שגיאה פנימית בעדכון האתר" },
      { status: 500 }
    );
  }
}