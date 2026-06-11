"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function AddSiteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaxedOut, setIsMaxedOut] = useState(false);

  // שליפת ה-userId מה-URL במידה ואדמין מבצע את הפעולה עבור לקוח
  const impersonatedUserId = searchParams.get("userId");
  const loggedInUserId = getCookie("userId");
  const userRole = getCookie("userRole");

  // קביעת זהות המשתמש הסופי שעבורו מתווסף האתר
  const isAdminAction = !!(impersonatedUserId && (userRole === "admin" || loggedInUserId === "admin"));
  const finalUserId = isAdminAction ? impersonatedUserId : loggedInUserId;

  const MAX_SITES_LIMIT = 3;

  // 🛡️ בדיקת הגנה: מוודאים בזמן טעינה שהמשתמש לא עקף את מגבלת 3 האתרים
  useEffect(() => {
    if (!finalUserId) return;

    fetch(`http://localhost:8000/list-sites?user_id=${finalUserId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((sites) => {
        if (sites.length >= MAX_SITES_LIMIT) {
          setIsMaxedOut(true);
          setMessage(`🔒 הגעת למגבלת החבילה החינמית (${MAX_SITES_LIMIT} אתרים). לא ניתן להוסיף אתרים נוספים.`);
        }
      })
      .catch((err) => console.error("Error verifying site limit:", err));
  }, [finalUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxedOut) return;

    setMessage("🔍 בודק את סטטוס האתר ומקשר לחשבון...");
    setIsLoading(true);

    try {
      if (!finalUserId) {
        throw new Error("מזהה משתמש לא נמצא");
      }

      // שליחת הבקשה עם ה-ID הנכון (של הלקוח או המשתמש המקורי)
      const res = await fetch(
        `http://localhost:8000/check?url=${encodeURIComponent(url)}&user_id=${finalUserId}`
      );
      
      if (!res.ok) throw new Error("השרת החזיר שגיאה בתהליך השמירה");
      
      const data = await res.json();
      
      setMessage(
        data.status === "UP"
          ? "✅ האתר נבדק, נמצא תקין ונוסף בהצלחה לניטור!"
          : "⚠️ האתר נוסף לניטור, אך נראה שהוא כרגע למטה או חסום."
      );
      
      setUrl("");
      
      // ניתוח חזרה אוטומטי לדשבורד הנכון לאחר 2 שניות
      setTimeout(() => {
        const backUrl = isAdminAction ? `/dashboard?viewAs=${impersonatedUserId}` : "/dashboard";
        router.push(backUrl);
      }, 2000);

    } catch (err) {
      console.error("Add Site Error:", err);
      setMessage("❌ שגיאה בחיבור לשרת או שהאתר כבר קיים במערכת");
    } finally {
      setIsLoading(false);
    }
  };

  // בניית נתיב חזרה חכם ששומר על מצב אדמין
  const backLink = isAdminAction ? `/dashboard?viewAs=${impersonatedUserId}` : "/dashboard";

  return (
    <div className="max-w-xl mx-auto text-gray-950" dir="rtl">
      
      {/* כפתור חזרה חכם המונע ניתוק רצף העבודה */}
      <Link href={backLink} className="text-gray-400 hover:text-gray-900 mb-6 inline-block text-sm transition-all">
        ← חזרה ל-Dashboard
      </Link>

      {/* כרטיס הטופס */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="text-center mb-8">
          {isAdminAction && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide inline-block mb-3">
              🛡️ פעולת מנהל: הוספה עבור לקוח
            </span>
          )}
          <h2 className="text-2xl font-black tracking-tight text-gray-950 mb-1">
            הוספת אתר לניטור
          </h2>
          <p className="text-xs text-gray-400 font-mono">הזן כתובת אתר לבדיקה וניטור אוטומטי</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2 text-sm font-medium">
              כתובת ה-URL של האתר:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm placeholder-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none transition-all text-left"
              placeholder="https://example.com"
              required
              disabled={isLoading || isMaxedOut}
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isMaxedOut}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none text-sm"
          >
            {isLoading ? "מעבד נתונים..." : "בדוק והוסף למערכת"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 text-center text-xs py-3 rounded-xl font-mono border ${
            isMaxedOut ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-600'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// עטיפת ה-Layout ב-Suspense כנדרש ב-Next.js
export default function AddSitePage() {
  return (
    <Suspense fallback={
      <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">טוען ממשק הוספה...</p>
      </div>
    }>
      <AddSiteContent />
    </Suspense>
  );
}