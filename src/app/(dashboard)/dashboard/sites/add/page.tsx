"use client";

import { useState } from "react";
import Link from "next/link";

// פונקציית עזר קטנה לשליפת קוקי בצד הלקוח (Client Side)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function AddSitePage() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("🔍 בודק את סטטוס האתר ומקשר לחשבונך...");
    setIsLoading(true);

    try {
      // שליפת מזהה המשתמש המחובר מהקוקיז
      const userId = getCookie("userId");

      if (!userId) {
        setMessage("❌ שגיאה: מזהה משתמש לא נמצא. נא להתחבר מחדש.");
        setIsLoading(false);
        return;
      }

      // שליחת ה-URL יחד עם ה-userId לפייתון כדי שידע לשייך את האתר אלייך
      const res = await fetch(
        `http://localhost:8000/check?url=${encodeURIComponent(url)}&user_id=${userId}`
      );
      
      if (!res.ok) throw new Error("השרת החזיר שגיאה");
      
      const data = await res.json();
      
      setMessage(
        data.status === "UP"
          ? "✅ האתר נבדק, נמצא תקין ונוסף בהצלחה לניטור!"
          : "⚠️ האתר נוסף לניטור, אך נראה שהוא כרגע למטה או חסום."
      );
      setUrl("");
    } catch (err) {
      console.error("Add Site Error:", err);
      setMessage("❌ שגיאה בחיבור לשרת הפייתון או בשמירת הנתונים");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto text-white">
      {/* כפתור חזרה לדשבורד */}
      <Link href="/dashboard" className="text-zinc-500 hover:text-white mb-6 inline-block text-sm transition-all">
        ← חזרה ל-Dashboard
      </Link>

      {/* כרטיס הטופס מעודכן לעיצוב הכהה היוקרתי */}
      <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-900 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight uppercase mb-1">
            הוספת אתר לניטור
          </h2>
          <p className="text-xs text-zinc-500 font-mono">הזן כתובת אתר לבדיקה וניטור אוטומטי</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-zinc-400 mb-2 text-sm font-medium">
              כתובת ה-URL של האתר:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3.5 bg-black border border-zinc-900 rounded-xl text-white font-mono text-sm placeholder-zinc-700 focus:border-zinc-700 focus:outline-none transition-all"
              placeholder="https://example.com"
              required
              disabled={isLoading}
            />
          </div>

          {/* כפתור הגשה מעוצב מחדש (לבן מינימליסטי) */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            {isLoading ? "מעבד נתונים..." : "בדוק והוסף למערכת"}
          </button>
        </form>

        {/* הודעות סטטוס ותשובות מהשרת */}
        {message && (
          <div className="mt-6 text-center text-xs text-zinc-300 bg-zinc-900/40 border border-zinc-900 py-3 rounded-xl font-mono">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}