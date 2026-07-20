import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");
    const idParam = searchParams.get("id");
    const userId = searchParams.get("user_id") || searchParams.get("userId");

    if (!userId || (!urlParam && !idParam)) {
      return NextResponse.json(
        { detail: "חסרים פרמטרים חיוניים למחיקה (user_id וגם url/id)" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("site_monitor");

    const deleteConditions: Filter<Document>[] = [];

    // מחיקה לפי ID אם קיים
    if (idParam && ObjectId.isValid(idParam)) {
      deleteConditions.push({ _id: new ObjectId(idParam) });
    }

    // מחיקה לפי URL אם קיים (ניקוי סלאשים ופרוטוקול)
    if (urlParam) {
      const cleanUrl = urlParam.trim();
      const normalizedUrl = cleanUrl.replace(/^\/+/, ""); // הסרת סלאשים בהתחלה
      const fullHttpsUrl = normalizedUrl.startsWith("http") ? normalizedUrl : `https://${normalizedUrl}`;

      deleteConditions.push({ url: cleanUrl });
      deleteConditions.push({ url: normalizedUrl });
      deleteConditions.push({ url: fullHttpsUrl });
      deleteConditions.push({ url: `http://${normalizedUrl}` });
    }

    // שילוב תנאי המשתמש (תמיכה בשני שמות השדות)
    const userConditions: Filter<Document>[] = [
      { userId: userId },
      { user_id: userId },
    ];
    if (ObjectId.isValid(userId)) {
      userConditions.push({ userId: new ObjectId(userId) });
      userConditions.push({ user_id: new ObjectId(userId) });
    }

    const finalQuery = {
      $and: [
        { $or: deleteConditions },
        { $or: userConditions },
      ],
    };

    const result = await db.collection("sites").deleteMany(finalQuery);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { detail: "האתר לא נמצא במסד הנתונים או שאין הרשאה למחוק אותו" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "האתר ונתוניו נמחקו בהצלחה",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Site Error:", error);
    return NextResponse.json(
      { detail: "שגיאה פנימית בשרת בעת ניסיון המחיקה" },
      { status: 500 }
    );
  }
}