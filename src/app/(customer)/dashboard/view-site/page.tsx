"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SiteAnalyticsGraph } from "@/components/dashboard/SiteAnalyticsGraph";
import { SiteLogsTable } from "@/components/dashboard/SiteLogsTable";

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
  const siteId = searchParams.get("id");
  const viewAsId = searchParams.get("viewAs");

  const [stats, setStats] = useState<SiteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loggedInUserId = getCookie("userId");
  const userRole = getCookie("userRole");
  const isAdminAction = !!(
    viewAsId &&
    (userRole === "admin" || loggedInUserId === "admin")
  );
  const targetUserId = isAdminAction ? viewAsId : loggedInUserId;

  const round = (num: number) => Math.round(num);

  const fetchHistoryData = async () => {
    if ((!siteUrl && !siteId) || !targetUserId) return;

    // פנייה ל-API המעודכן שלנו /api/site-details
    const endpoint = siteId 
      ? `/api/site-details?id=${siteId}`
      : `/api/site-details?url=${encodeURIComponent(siteUrl || "")}&user_id=${targetUserId}`;

    const res = await fetch(endpoint);
    if (!res.ok) {
      throw new Error("נכשל בטעינת פרטי האתר וההיסטוריה משרת הניטור");
    }
    const data = await res.json();

    const history = data.history || [];
    const uptime = data.uptime_percentage !== undefined 
      ? data.uptime_percentage 
      : history.length 
        ? round((history.filter((h: HistoryLog) => h.status === "ONLINE" || h.status === "UP").length / history.length) * 100)
        : 100;

    const avgTime = data.average_response_time !== undefined
      ? data.average_response_time
      : history.length
        ? round(history.reduce((acc: number, log: HistoryLog) => acc + (log.response_time || 0), 0) / history.length)
        : 120;

    const currentUrl = data.site?.url || siteUrl || "";

    setStats({
      url: currentUrl,
      uptime_percentage: uptime,
      average_response_time: avgTime,
      history: history.map((item: { timestamp?: string; createdAt?: string; status?: string; responseTime?: number; response_time?: number }) => ({
        timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
        status: item.status || "ONLINE",
        response_time: item.responseTime || item.response_time || 120,
      })),
    });
    setEditUrl(currentUrl);
    setLoading(false);
  };

  useEffect(() => {
    if (!siteUrl && !siteId) {
      setErrorMsg("❌ שגיאה: כתובת האתר לא צוינה בקישור.");
      setLoading(false);
      return;
    }
    if (!targetUserId) {
      setErrorMsg("❌ מזהה משתמש לא נמצא. נא להתחבר מחדש.");
      setLoading(false);
      return;
    }
    if (isAdminAction) {
      setIsImpersonating(true);
    }

    fetchHistoryData().catch((err: unknown) => {
      console.error("Fetch Site History Error:", err);
      setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור או שהנתונים אינם קיימים.");
      setLoading(false);
    });
  }, [siteUrl, siteId, targetUserId, isAdminAction]);

  const backLink = isImpersonating
    ? `/dashboard?viewAs=${viewAsId}`
    : "/dashboard";

  // ⚡ הרצת בדיקה יזומה
  const handleManualCheck = async () => {
    if (!stats?.url || actionLoading) return;
    setActionLoading(true);
    setActionMessage("⚡ מריץ בדיקת שרת יזומה ומעדכן את ההיסטוריה...");

    try {
      const res = await fetch("/api/add-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: stats.url, user_id: targetUserId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "הבדיקה היזומה נכשלה");

      setActionMessage("✨ הבדיקה הושלמה בהצלחה! מרענן נתונים...");
      await fetchHistoryData();

      setTimeout(() => {
        setActionMessage(null);
        setActionLoading(false);
      }, 1500);
    } catch (err: unknown) {
      console.error("Manual check error:", err);
      setActionMessage(
        err instanceof Error
          ? `❌ שגיאה: ${err.message}`
          : "שגיאה בביצוע הסריקה",
      );
      setActionLoading(false);
    }
  };

  const handleDeleteSite = async () => {
    if (
      !window.confirm(
        "🚨 האם אתה בטוח שברצונך למחוק אתר זה? פעולה זו אינה הפיכה!",
      )
    )
      return;
    if (!stats?.url || !targetUserId) return;
    setActionLoading(true);
    setActionMessage("🧹 מוחק את האתר ונתוני הבדיקות מהשרת...");

    try {
      const res = await fetch(
        `/api/delete-site?url=${encodeURIComponent(stats.url)}&user_id=${targetUserId}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "נכשל בתהליך המחיקה");

      setActionMessage("✅ האתר נמחק בהצלחה! מחזיר אותך לדשבורד...");
      setTimeout(() => router.push(backLink), 1500);
    } catch (err: unknown) {
      setActionMessage(
        err instanceof Error ? `❌ שגיאה: ${err.message}` : "שגיאה בתקשורת",
      );
      setActionLoading(false);
    }
  };

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stats?.url || !targetUserId || !editUrl.trim()) return;
    setActionLoading(true);
    setActionMessage("📝 מעדכן את כתובת האתר ומריץ סריקה ראשונית...");

    try {
      const res = await fetch("/api/update-site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_url: stats.url.trim(),
          new_url: editUrl.trim(),
          user_id: targetUserId.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "נכשל בתהליך העדכון בשרת");

      setActionMessage("✅ הכתובת עודכנה בהצלחה! מרענן נתונים...");
      setTimeout(() => {
        setIsEditing(false);
        setActionMessage(null);
        setActionLoading(false);
        router.push(
          isImpersonating
            ? `/dashboard/view-site?url=${encodeURIComponent(editUrl.trim())}&viewAs=${viewAsId}`
            : `/dashboard/view-site?url=${encodeURIComponent(editUrl.trim())}`,
        );
      }, 1500);
    } catch (err: unknown) {
      setActionMessage(
        err instanceof Error ? `❌ שגיאה: ${err.message}` : "שגיאה בתקשורת",
      );
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
        dir="rtl"
      >
        <p className="text-gray-400 font-mono text-sm animate-pulse">
          טוען היסטוריה וגרפים של האתר...
        </p>
      </div>
    );
  }

  if (errorMsg || !stats) {
    return (
      <div className="max-w-2xl mx-auto" dir="rtl">
        <Link
          href={backLink}
          className="text-gray-400 hover:text-gray-900 mb-6 inline-block text-sm transition-transform duration-200 hover:translate-x-1"
        >
          ← חזרה ל-Dashboard
        </Link>
        <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
          <p className="text-red-600 text-sm font-medium">
            {errorMsg || "שגיאה בטעינת הנתונים"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-gray-900 space-y-8" dir="rtl">
      {isImpersonating && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center text-amber-900 text-xs font-bold shadow-sm animate-in slide-in-from-top-2">
          <span>👀 פנל ניהול: צפייה באנליטיקה של לקוח מנוהל</span>
          <Link
            href={`/dashboard?viewAs=${viewAsId}`}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl transition-all active:scale-95"
          >
            חזרה לדשבורד המנוהל ←
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <Link
            href={backLink}
            className="text-gray-400 hover:text-gray-950 mb-2 inline-block text-sm transition-all hover:translate-x-1"
          >
            ← חזרה לכל האתרים
          </Link>
          <h1 className="text-2xl font-black text-gray-950 truncate tracking-tight font-mono">
            {stats.url.replace("https://", "").replace("http://", "")}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            אנליטיקה, יציבות וניהול הגדרות בזמן אמת
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleManualCheck}
            disabled={actionLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xs disabled:opacity-40 cursor-pointer"
          >
            {actionLoading ? "⚡ סורק אתר..." : "⚡ בדוק עכשיו"}
          </button>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setActionMessage(null);
            }}
            disabled={actionLoading}
            className="bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-100 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xs disabled:opacity-40"
          >
            {isEditing ? "ביטול עריכה" : "📝 ערוך URL"}
          </button>
          <button
            onClick={handleDeleteSite}
            disabled={actionLoading}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 px-4 py-2 rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xs disabled:opacity-40"
          >
            🗑️ מחק אתר
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white border border-indigo-100 p-5 rounded-2xl shadow-xs animate-in slide-in-from-top-2 duration-200">
          <form
            onSubmit={handleUpdateSite}
            className="flex flex-col sm:flex-row items-end gap-4"
          >
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">
                עדכן כתובת URL לניטור:
              </label>
              <input
                type="url"
                required
                disabled={actionLoading}
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-indigo-300 focus:bg-white text-left"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm w-full sm:w-auto"
            >
              שמור שינויים
            </button>
          </form>
        </div>
      )}

      {actionMessage && (
        <div className="p-3 bg-gray-950 text-white font-mono text-center text-xs rounded-xl shadow-md border border-gray-800">
          {actionMessage}
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              זמינות האתר (Uptime)
            </span>
            <span className="text-3xl font-black text-emerald-600 font-mono">
              {stats.uptime_percentage}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm">
            ✓
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              זמן תגובה ממוצע
            </span>
            <span className="text-3xl font-black text-indigo-600 font-mono">
              {stats.average_response_time}{" "}
              <span className="text-xs font-medium text-gray-400">ms</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-sm">
            ⚡
          </div>
        </div>
      </div>

      <SiteAnalyticsGraph history={stats.history} />
      <SiteLogsTable history={stats.history} />
    </div>
  );
}

export default function ViewSitePage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
          dir="rtl"
        >
          <p className="text-gray-400 font-mono text-sm animate-pulse">
            טוען נתוני אנליטיקה...
          </p>
        </div>
      }
    >
      <ViewSiteContent />
    </Suspense>
  );
}