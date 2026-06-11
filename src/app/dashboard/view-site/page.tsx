"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface HistoryLog {
  timestamp: string;
  status: string;
  response_time: number; // במילישניות
}

interface SiteStats {
  url: string;
  uptime_percentage: number;
  average_response_time: number;
  history: HistoryLog[];
}

// פונקציית עזר לשליפת קוקי בצד הלקוח
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function ViewSitePage() {
  const searchParams = useSearchParams();
  const siteUrl = searchParams.get("url"); // שליפת ה-URL מכתובת הדפדפן

  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!siteUrl) {
      setErrorMsg("❌ שגיאה: כתובת האתר לא צוינה בקישור.");
      setLoading(false);
      return;
    }

    const userId = getCookie("userId");
    if (!userId) {
      setErrorMsg("❌ מזהה משתמש לא נמצא. נא להתחבר מחדש.");
      setLoading(false);
      return;
    }

    // פנייה לפייתון לקבלת היסטוריית הניטור והסטטיסטיקות של האתר הספציפי
    fetch(`http://localhost:8000/site-history?url=${encodeURIComponent(siteUrl)}&user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("נכשל בטעינת היסטוריית האתר מהשרת");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Site History Error:", err);
        setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור או שהנתונים אינם קיימים.");
        setLoading(false);
      });
  }, [siteUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">טוען היסטוריה וגרפים של האתר...</p>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="max-w-2xl mx-auto" dir="rtl">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 mb-6 inline-block text-sm">
          ← חזרה ל-Dashboard
        </Link>
        <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
          <p className="text-red-600 text-sm font-medium">{errorMsg || "שגיאה בטעינת הנתונים"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-gray-900 space-y-8" dir="rtl">
      
      {/* כפתור חזרה וכותרת ראשית */}
      <div>
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 mb-4 inline-block text-sm transition-all">
          ← חזרה לכל האתרים
        </Link>
        <h1 className="text-2xl font-black text-gray-950 truncate tracking-tight font-mono">
          {stats.url.replace("https://", "").replace("http://", "")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">אנליטיקה, יציבות וזמני תגובה בזמן אמת</p>
      </div>

      {/* 📊 כרטיסי מונים גדולים (סטטיסטיקה עליונה) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        {/* כרטיס אחוז Uptime */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">זמינות האתר (Uptime)</span>
            <span className="text-3xl font-black text-emerald-600 font-mono">{stats.uptime_percentage}%</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 text-xl flex items-center justify-center">🟢</div>
        </div>

        {/* כרטיס זמן תגובה ממוצע */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">זמן תגובה ממוצע</span>
            <span className="text-3xl font-black text-blue-600 font-mono">{stats.average_response_time} <span className="text-xs font-medium text-gray-400">ms</span></span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 text-xl flex items-center justify-center">⚡</div>
        </div>
      </div>

      {/* 📈 גרף ויזואלי נקי לזמני תגובה (נבנה בעזרת CSS/Tailwind) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-6">מהירות תגובת שרת בבדיקות האחרונות (במילישניות)</h3>
        
        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100 font-mono">
          {stats.history.slice(-10).map((log, index) => {
            // חישוב אחוז הגובה של העמודה (מקסימום גובה מוגדר ל-2000ms לצורך פרופורציה)
            const heightPercentage = Math.min((log.response_time / 2000) * 100, 100);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                {/* בועת מידע בריחופ עכבר */}
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {log.response_time} ms ({new Date(log.timestamp).toLocaleTimeString("he-IL")})
                </div>
                
                {/* העמודה עצמה */}
                <div 
                  style={{ height: `${heightPercentage}%` }} 
                  className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${
                    log.status === "UP" ? "bg-blue-500" : "bg-rose-500"
                  }`}
                />
                
                {/* שעה מתחת לעמודה */}
                <span className="text-[9px] text-gray-400 mt-2 block tracking-tighter">
                  {new Date(log.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📜 טבלת היסטוריית אירועים ובדיקות אחרונות */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">יומן בדיקות מפורט (לוגים)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400">
                <th className="p-4 font-bold uppercase">זמן בדיקה</th>
                <th className="p-4 font-bold uppercase text-center">סטטוס</th>
                <th className="p-4 font-bold uppercase text-left">זמן תגובה</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.history.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-4 text-gray-600">
                    {new Date(log.timestamp).toLocaleString("he-IL")}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "UP" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {log.status === "UP" ? "ONLINE" : "OFFLINE"}
                    </span>
                  </td>
                  <td className="p-4 text-left font-bold text-gray-700">
                    {log.response_time} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}