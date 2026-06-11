"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Site {
  url: string;
  status: string;
  last_checked: string;
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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // הגדרת מגבלת האתרים לחשבון
  const MAX_SITES_LIMIT = 3; 

  useEffect(() => {
    const userId = getCookie("userId");

    // אם אין מזהה משתמש - נעדכן את השגיאה והטעינה בפעימה אחת אסינכרונית קלה
    if (!userId) {
      setTimeout(() => {
        setErrorMsg("מזהה משתמש לא נמצא. נא להתחבר מחדש.");
        setLoading(false);
      }, 0);
      return;
    }

    // שליחת ה-userId לפייתון לקבלת האתרים שלו
    fetch(`http://localhost:8000/list-sites?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("שגיאה בקבלת הנתונים מהשרת");
        return res.json();
      })
      .then((data) => {
        setSites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Fetch Error:", err);
        setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור בפייתון.");
        setLoading(false);
      });
  }, []);

  // בדיקה האם המשתמש הגיע למגבלת האתרים שלו
  const isLimitReached = sites.length >= MAX_SITES_LIMIT;

  return (
    <div className="max-w-6xl mx-auto text-gray-900" dir="rtl">
      {/* כותרת וכפתור הוספה בעיצוב בהיר */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 mb-1">האתרים שלי</h1>
          <p className="text-xs text-gray-400 font-mono">
            ניהול וסטטיסטיקות בזמן אמת ({sites.length}/{MAX_SITES_LIMIT} אתרים בשימוש)
          </p>
        </div>

        {isLimitReached ? (
          <div className="text-left">
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

      {/* מצב טעינה */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 font-mono text-sm animate-pulse">טוען נתונים מהדאטהבייס...</p>
        </div>
      ) : errorMsg ? (
        /* מצב שגיאה */
        <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100">
          <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
        </div>
      ) : sites.length === 0 ? (
        /* מצב שבו אין אתרים ברשימה */
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm italic mb-4">
            אין עדיין אתרים תחת החשבון שלך. הגיע הזמן להוסיף את האתר הראשון!
          </p>
          <Link href="/dashboard/add-site" className="text-blue-600 hover:underline text-sm font-bold">
            לחץ כאן כדי להוסיף אתר ראשון
          </Link>
        </div>
      ) : (
        /* רשימת האתרים (גריד כרטיסים בהירים) */
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
                  <span>בדיקה אחרונה:</span>
                  <span className="text-gray-600 font-mono">
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