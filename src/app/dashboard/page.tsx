"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Site {
  url: string;
  status: string;
  last_checked: string;
}

interface UserProfile {
  name: string;
  email: string;
  plan: string;
}

// פונקציית עזר לשליפת קוקי בצד הלקוח
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const MAX_SITES_LIMIT = 3; 

  useEffect(() => {
    const userId = getCookie("userId");

    if (!userId) {
      setTimeout(() => {
        setErrorMsg("מזהה משתמש לא נמצא. נא להתחבר מחדש.");
        setLoading(false);
      }, 0);
      return;
    }

    // קריאה ראשונה: שליפת פרטי הפרופיל (עם מנגנון הגנה מקומי מפני קריסה)
    const fetchProfile = fetch(`http://localhost:8000/user-profile?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בטעינת פרופיל משתמש");
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => {
        console.warn("User profile endpoint failed, fallback to local temporary info:", err);
        // פתרון חוסן: מונע מכל הדף לקרוס במידה והנתיב בפייתון לא קיים/תקין
        setProfile({
          name: "משתמש מחובר",
          email: "פרופיל בטעינה...",
          plan: "Premium החינמית"
        });
      });

    // קריאה שנייה: שליפת רשימת האתרים שלו
    const fetchSites = fetch(`http://localhost:8000/list-sites?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בקבלת רשימת האתרים");
        return res.json();
      })
      .then((data) => setSites(data));

    // הרצת שתי הקריאות יחד וסיום מצב טעינה
    Promise.all([fetchProfile, fetchSites])
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור בפייתון.");
        setLoading(false);
      });
  }, []);

  const isLimitReached = sites.length >= MAX_SITES_LIMIT;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">טוען נתוני חשבון ואתרים...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100 max-w-2xl mx-auto" dir="rtl">
        <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-gray-900 space-y-10" dir="rtl">
      
      {/* 👤 כרטיס פרופיל אישי עליון */}
      {profile && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center shadow-inner">
              {profile.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-950">שלום, {profile.name}</h2>
              <p className="text-xs text-gray-400 font-mono">{profile.email}</p>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide">
              📋 תוכנית: {profile.plan || "Premium החינמית"}
            </span>
          </div>
        </div>
      )}

      {/* 🌐 כותרת רשימת האתרים וכפתור הוספה */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-950 mb-1">האתרים שלי</h1>
          <p className="text-xs text-gray-400 font-mono">
            סטטוס הניטור שלך ({sites.length}/{MAX_SITES_LIMIT} אתרים בשימוש)
          </p>
        </div>

        {isLimitReached ? (
          <div>
            <span className="bg-amber-50 text-amber-600 border border-amber-200 px-4 py-2.5 rounded-xl font-bold text-xs">
              🔒 הגעת למגבלת החבילה ({MAX_SITES_LIMIT} אתרים)
            </span>
          </div>
        ) : (
          <Link
            href="/dashboard/add-site"
            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
          >
            + הוסף אתר לניטור
          </Link>
        )}
      </div>

      {/* גריד כרטיסי האתרים */}
      {sites.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm italic mb-4">
            אין עדיין אתרים תחת החשבון שלך. הגיע הזמן להוסיף את האתר הראשון!
          </p>
          <Link href="/dashboard/add-site" className="text-blue-600 hover:underline text-sm font-bold">
            לחץ כאן כדי להוסיף אתר ראשון
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site, index) => (
            <Link
              href={`/dashboard/view-site?url=${encodeURIComponent(site.url)}`}
              key={index}
              className="group block"
            >
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group-hover:border-gray-200 group-hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <div className="flex justify-between items-start mb-6 gap-3">
                  <h3 className="font-mono text-base font-bold truncate w-3/4 text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                    {site.url.replace("https://", "").replace("http://", "")}
                  </h3>

                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      site.status === "UP"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}
                  >
                    {site.status === "UP" ? "תקין" : "למטה"}
                  </span>
                </div>

                <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-gray-400 text-xs font-medium">
                  <span className="text-blue-600 group-hover:underline">נתוני ניטור מורחבים ←</span>
                  <span className="text-gray-500 font-mono text-[11px]">
                    {site.last_checked ? new Date(site.last_checked).toLocaleTimeString("he-IL") : "---"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}