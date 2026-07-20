import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId, Filter, Document } from "mongodb";

// פונקציית בדיקה בלייב
async function pingSite(url: string) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let targetUrl = url.trim().replace(/^\/+/, "");
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    const res = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal,
      headers: { "User-Agent": "SiteMonitor-Bot/1.0" },
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    const isUp = res.status >= 200 && res.status < 400;

    return {
      status: isUp ? "ONLINE" : "OFFLINE",
      responseTime,
      statusCode: res.status,
      isUp,
    };
  } catch {
    return {
      status: "OFFLINE",
      responseTime: Date.now() - startTime,
      statusCode: 0,
      isUp: false,
    };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");
    const idParam = searchParams.get("id");
    const userId = searchParams.get("user_id") || searchParams.get("userId");

    const client = await clientPromise;
    const db = client.db("site_monitor");

    const queryConditions: Filter<Document>[] = [];

    if (idParam && ObjectId.isValid(idParam)) {
      queryConditions.push({ _id: new ObjectId(idParam) });
    }

    if (urlParam) {
      const cleanUrl = urlParam.trim();
      const normalizedUrl = cleanUrl.replace(/^\/+/, "");
      queryConditions.push({ url: cleanUrl });
      queryConditions.push({ url: normalizedUrl });
      queryConditions.push({ url: `https://${normalizedOldUrl(cleanUrl)}` });
    }

    function normalizedOldUrl(u: string) {
      return u.trim().replace(/^\/+/, "").replace(/^https?:\/\//, "");
    }

    let site = null;
    if (queryConditions.length > 0) {
      site = await db.collection("sites").findOne({ $or: queryConditions });
    }

    if (!site && urlParam) {
      // אם לא נמצא ב-DB, ניצור אובייקט זמני מתוקן
      let clean = urlParam.trim().replace(/^\/+/, "");
      if (!clean.startsWith("http")) clean = `https://${clean}`;
      site = { url: clean, userId };
    }

    const targetUrl = site?.url || urlParam || "";

    // 🚀 מריצים בדיקת לייב לקבלת סטטוס עדכני
    const liveCheck = await pingSite(targetUrl);

    // עדכון הסטטוס ב-DB
    if (site?._id) {
      await db.collection("sites").updateOne(
        { _id: site._id },
        {
          $set: {
            status: liveCheck.status,
            isUp: liveCheck.isUp,
            responseTime: liveCheck.responseTime,
            lastChecked: new Date(),
          },
        }
      );
    }

    // שליפת הסטוריית לוגים או יצירת לוג ראשוני
    const historyLog = {
      timestamp: new Date().toISOString(),
      status: liveCheck.status,
      response_time: liveCheck.responseTime,
      isUp: liveCheck.isUp,
    };

    return NextResponse.json({
      site: {
        _id: site?._id?.toString() || "",
        url: targetUrl,
        status: liveCheck.status,
        isUp: liveCheck.isUp,
      },
      uptime_percentage: liveCheck.isUp ? 100 : 0,
      average_response_time: liveCheck.responseTime,
      history: [historyLog],
    });
  } catch (error) {
    console.error("Site Details Error:", error);
    return NextResponse.json(
      { error: "שגיאה בשליפת פרטי האתר" },
      { status: 500 }
    );
  }
}