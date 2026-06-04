"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// הגדרת המבנה המדויק של תשובת השרת עבור TypeScript (במקום any!)
interface SiteCheckData {
  status: "UP" | "DOWN" | "PENDING";
  response_time: number;
}

export default function SiteDetails() {
  const params = useParams();

  // וידוא שהפרמטר מהנתיב מטופל כטקסט נקי
  const rawUrl = Array.isArray(params.url) ? params.url[0] : params.url;
  const decodedUrl = decodeURIComponent(rawUrl || "");

  const [data, setData] = useState<SiteCheckData | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!decodedUrl) return;

    // קריאה ל-Backend לקבלת נתונים טריים
    fetch(`http://localhost:8000/check?url=${encodeURIComponent(decodedUrl)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error("Error fetching site details:", err);
        setError(true);
      });
  }, [decodedUrl]);

  // פונקציה קטנה לקביעת צבע המהירות
  const getSpeedColor = (ms: number) => {
    if (ms < 300) return "text-green-400";
    if (ms < 1000) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white font-sans">
      <div className="max-w-4xl mx-auto">
        {/* התיקון: ניתוב נכון חזרה ל-/dashboard המאובטח ולא לדף הלוגין הראשי */}
        <Link
          href="/dashboard"
          className="text-gray-500 hover:text-white mb-8 inline-block transition-all"
        >
          ← חזרה ל-Dashboard
        </Link>

        <div className="bg-gray-900 border border-gray-800 p-10 rounded-3xl shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                כרטיס אתר
              </h1>
              <p className="text-blue-500 font-mono text-sm">{decodedUrl}</p>
            </div>
            <div
              className={`px-4 py-2 rounded-lg font-black ${data?.status === "UP" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
            >
              {error ? "שגיאה" : data ? data.status : "טוען..."}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* כרטיס זמן תגובה */}
            <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50">
              <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-widest">
                זמן תגובה אחרון
              </h4>
              <p
                className={`text-5xl font-mono font-bold ${data ? getSpeedColor(data.response_time) : "text-gray-700"}`}
              >
                {data?.response_time ? `${data.response_time}ms` : "---"}
              </p>
              <p className="text-gray-600 text-xs mt-4 italic">
                {data && data.response_time > 1000
                  ? "⚠️ האתר מגיב באיטיות חריגה"
                  : "🚀 המהירות תקינה"}
              </p>
            </div>

            {/* כרטיס מידע נוסף (הכנה להמשך) */}
            <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50 flex flex-col justify-center">
              <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-widest">
                מידע נוסף
              </h4>
              <p className="text-gray-400">
                בעדכון הבא נוסיף כאן היסטוריה וגרפים.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
