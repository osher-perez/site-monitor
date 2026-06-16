"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface HistoryLog {
  timestamp: string;
  status: string;
  response_time: number;
}

interface SiteStats {
  url: string;
  uptime_percentage: number;
  average_response_time: number;
  history: HistoryLog[];
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function ViewSiteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteUrl = searchParams.get("url");
  const viewAsId = searchParams.get("viewAs");

  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  // סטייטס חדשים לניהול עריכה ומחיקה
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loggedInUserId = getCookie("userId");
  const userRole = getCookie("userRole");
  const isAdminAction = !!(viewAsId && (userRole === "admin" || loggedInUserId === "admin"));
  const targetUserId = isAdminAction ? viewAsId : loggedInUserId;

  useEffect(() => {
    if (!siteUrl) {
      setTimeout(() => {
        setErrorMsg("❌ שגיאה: כתובת האתר לא צוינה בקישור.");
        setLoading(false);
      }, 0);
      return;
    }

    if (!targetUserId) {
      setTimeout(() => {
        setErrorMsg("❌ מזהה משתמש לא נמצא. נא להתחבר מחדש.");
        setLoading(false);
      }, 0);
      return;
    }

    if (isAdminAction) {
      setTimeout(() => {
        setIsImpersonating(true);
      }, 0);
    }

    fetch(`http://localhost:8000/site-history?url=${encodeURIComponent(siteUrl)}&user_id=${targetUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error("נכשל בטעינת היסטוריית האתר מהשרת");
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setEditUrl(data.url);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Fetch Site History Error:", err);
        setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור או שהנתונים אינם קיימים.");
        setLoading(false);
      });
  }, [siteUrl, targetUserId, isAdminAction]);

  const backLink = isImpersonating ? `/dashboard?viewAs=${viewAsId}` : "/dashboard";

  // 🗑️ לוגיקת מחיקת האתר מהמערכת
  const handleDeleteSite = async () => {
    if (!window.confirm("🚨 האם אתה בטוח שברצונך למחוק אתר זה ואת כל היסטוריית הלוגים שלו? פעולה זו אינה הפיכה!")) return;
    if (!siteUrl || !targetUserId) return;

    setActionLoading(true);
    setActionMessage("🧹 מוחק את האתר ונתוני הבדיקות מהשרת...");

    try {
      const res = await fetch(`http://localhost:8000/delete-site?url=${encodeURIComponent(siteUrl)}&user_id=${targetUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "נכשל בתהליך המחיקה מהשרת");

      setActionMessage("✅ האתר נמחק בהצלחה! מחזיר אותך לדשבורד...");
      setTimeout(() => {
        router.push(backLink);
      }, 1500);

    } catch (err: unknown) {
      console.error("Delete Site Error:", err);
      const errMsg = err instanceof Error ? err.message : "שגיאה בתקשורת מול השרת";
      setActionMessage(`❌ שגיאה: ${errMsg}`);
      setActionLoading(false);
    }
  };

  // 📝 לוגיקת עריכת כתובת ה-URL
  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl || !targetUserId || !editUrl.trim()) return;

    setActionLoading(true);
    setActionMessage("📝 מעדכן את כתובת האתר ומריץ סריקה ראשונית...");

    try {
      const res = await fetch("http://localhost:8000/update-site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_url: siteUrl.trim(),
          new_url: editUrl.trim(),
          user_id: targetUserId.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "נכשל בתהליך העדכון בשרת");

      setActionMessage("✅ הכתובת עודכנה בהצלחה! מרענן נתונים...");
      setTimeout(() => {
        setIsEditing(false);
        setActionMessage(null);
        setActionLoading(false);
        router.push(`${isImpersonating ? `/dashboard/view-site?url=${encodeURIComponent(editUrl.trim())}&viewAs=${viewAsId}` : `/dashboard/view-site?url=${encodeURIComponent(editUrl.trim())}`}`);
      }, 1500);

    } catch (err: unknown) {
      console.error("Update Site Error:", err);
      const errMsg = err instanceof Error ? err.message : "שגיאה בתקשורת מול השרת";
      setActionMessage(`❌ שגיאה: ${errMsg}`);
      setActionLoading(false);
    }
  };

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
        <Link href={backLink} className="text-gray-400 hover:text-gray-900 mb-6 inline-block text-sm">
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
      
      {/* ⚠️ באנר התראת מצב אדמין */}
      {isImpersonating && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center text-amber-900 text-xs font-bold shadow-sm">
          <span>👀 פנל ניהול: צפייה באנליטיקה של לקוח מנוהל</span>
          <Link href={`/dashboard?viewAs=${viewAsId}`} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl transition-all">
            חזרה לדשבורד המנוהל ←
          </Link>
        </div>
      )}

      {/* 🛠️ סרגל כלים עליון לפעולות עריכה ומחיקה */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <Link href={backLink} className="text-gray-400 hover:text-gray-900 mb-2 inline-block text-sm transition-all">
            ← חזרה לכל האתרים
          </Link>
          <h1 className="text-2xl font-black text-gray-950 truncate tracking-tight font-mono">
            {stats.url.replace("https://", "").replace("http://", "")}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">אנליטיקה, יציבות וניהול הגדרות בזמן אמת</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => { setIsEditing(!isEditing); setActionMessage(null); }}
            disabled={actionLoading}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs disabled:opacity-40"
          >
            {isEditing ? "ביטול עריכה" : "📝 ערוך URL"}
          </button>
          <button
            onClick={handleDeleteSite}
            disabled={actionLoading}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs disabled:opacity-40"
          >
            🗑️ מחק אתר
          </button>
        </div>
      </div>

      {/* 📝 חלונית עריכת הכתובת הדינמית */}
      {isEditing && (
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleUpdateSite} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">עדכן כתובת URL לניטור:</label>
              <input
                type="url"
                required
                disabled={actionLoading}
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-gray-300 text-left"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-gray-950 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-full sm:w-auto"
            >
              שמור שינויים
            </button>
          </form>
        </div>
      )}

      {/* הודעות חיווי לפעולות CRUD */}
      {actionMessage && (
        <div className="p-3 bg-gray-900 text-white font-mono text-center text-xs rounded-xl shadow-md">
          {actionMessage}
        </div>
      )}

      {/* 📊 כרטיסי מונים גדולים */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">זמינות האתר (Uptime)</span>
            <span className="text-3xl font-black text-emerald-600 font-mono">{stats.uptime_percentage}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm">✓</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">זמן תגובה ממוצע</span>
            <span className="text-3xl font-black text-blue-600 font-mono">{stats.average_response_time} <span className="text-xs font-medium text-gray-400">ms</span></span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">⚡</div>
        </div>
      </div>

      {/* 📈 גרף עמודות */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-6">מהירות תגובת שרת בבדיקות האחרונות (במילישניות)</h3>
        
        <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100 font-mono">
          {stats.history.slice(-10).map((log, index) => {
            const heightPercentage = Math.min((log.response_time / 2000) * 100, 100);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  {log.response_time} ms ({new Date(log.timestamp).toLocaleTimeString("he-IL")})
                </div>
                
                <div 
                  style={{ height: `${heightPercentage}%` }} 
                  className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${
                    log.status === "UP" ? "bg-blue-500" : "bg-rose-500"
                  }`}
                />
                
                <span className="text-[9px] text-gray-400 mt-2 block tracking-tighter">
                  {new Date(log.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📜 טבלת לוגים */}
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

export default function ViewSitePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">טוען נתוני אנליטיקה...</p>
      </div>
    }>
      <ViewSiteContent />
    </Suspense>
  );
}