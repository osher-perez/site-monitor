"use client";

import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

// פונקציית עזר למחיקת קוקי בצד הלקוח על ידי הגדרת תאריך תפוגה בעבר
function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🚪 לוגיקת התנתקות הרמטית - מחיקת קוקיז וניקוי סשן
  const handleLogout = (): void => {
    if (!window.confirm("🚪 האם אתה בטוח שברצונך להתנתק מהמערכת?")) return;
    
    setIsLoggingOut(true);

    try {
      // מחיקת כל עוגיות האימות והתפקידים של המערכת
      deleteCookie("userId");
      deleteCookie("userRole");
      deleteCookie("isAdmin");

      // ניתוב מחדש לשער הכניסה הסטרילי
      router.replace("/auth");
    } catch (err: unknown) {
      console.error("Logout Error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      
      {/* התפריט הצדדי של המשתמש - מוצג בצד ימין */}
      <Sidebar />
      
      {/* אזור התוכן המרכזי והבר העליון */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* הבר העליון (Header) - משולב עם כפתור התנתקות גלובלי מאובטח */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 justify-between shadow-xs">
          
          <div className="font-black tracking-tight text-gray-800 text-sm">
            מרכז בקרה וניטור אתרים
          </div>
          
          {/* אזור הפעולות והסטטוס הימני/שמאלי של הבר */}
          <div className="flex items-center gap-4">
            {/* נורית חיווי LIVE */}
            <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-emerald-700 font-mono font-black tracking-wider">LIVE MONITORING</span>
            </div>

            {/* ✅ משימה 3: כפתור התנתקות גלובלי, נקי ומהיר ללא any */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-xs font-bold text-gray-400 hover:text-rose-600 border border-transparent hover:border-rose-100 hover:bg-rose-50/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-40"
            >
              {isLoggingOut ? "מתנתק..." : "🚪 התנתק"}
            </button>
          </div>
        </header>

        {/* הדפים הפנימיים יוזרקו כאן בפנים על רקע בהיר */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}