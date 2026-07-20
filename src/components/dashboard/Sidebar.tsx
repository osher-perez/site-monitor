"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  // 🔔 מוק זמני למונה הודעות שלא נקראו
  const [unreadCount] = useState(3);

  const handleLogout = async () => {
    try {
      // 1. קריאה לשרת לניקוי ה-Cookies המאובטחים
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed, falling back to client cleanup:", err);
    }

    // 2. ניקוי גיבוי יסודי של כל ה-Cookies בצד לקוח (כולל userName ו-userRole)
    const cookiesToClear = ["userId", "userRole", "userName"];
    cookiesToClear.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    // 3. איפוס הניווט ומעבר לדף ההתחברות
    window.location.href = "/auth";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className="w-64 bg-white border-l border-gray-100 p-6 hidden md:flex flex-col shrink-0 min-h-screen shadow-sm text-right font-sans"
      dir="rtl"
    >
      {/* אזור המותג ותגית הסטטוס */}
      <div className="mb-10 px-2">
        <Link
          href="/dashboard"
          className="text-xl font-black tracking-tighter uppercase text-indigo-600 hover:opacity-80 transition flex items-center gap-2"
        >
          <span>
            Site<span className="text-gray-500 font-medium">Monitor</span>
          </span>
          <span className="text-[9px] font-mono tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold uppercase">
            Console
          </span>
        </Link>
      </div>

      {/* ניווט מערכתי */}
      <nav className="space-y-2 grow">
        {/* 1. מרכז בקרה */}
        <Link
          href="/dashboard"
          className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border transform hover:scale-[1.02] active:scale-[0.98] ${
            isActive("/dashboard")
              ? "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs font-black"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          מרכז בקרה
        </Link>

        {/* 2. הוספת אתר למעקב */}
        <Link
          href="/dashboard/add-site"
          className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border transform hover:scale-[1.02] active:scale-[0.98] ${
            isActive("/dashboard/add-site")
              ? "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs font-black"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          + הוספת אתר (URL) למעקב
        </Link>

        {/* 3. יומן התראות */}
        <Link
          href="/dashboard/alerts"
          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border transform hover:scale-[1.02] active:scale-[0.98] ${
            isActive("/dashboard/alerts")
              ? "bg-indigo-50 border-indigo-100 text-indigo-600 shadow-xs font-black"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span>יומן התראות</span>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[9px] font-black font-mono text-white ring-2 ring-white animate-pulse transition-transform duration-200">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </nav>

      {/* אזור מערכת תחתון - כפתור יציאה ממוסגר ומסודר */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-bold text-red-600 bg-white hover:bg-red-50 rounded-xl transition-all border border-gray-200 hover:border-red-200 cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <span>יציאה מהמערכת</span>
          <span className="text-[12px] font-bold">→</span>
        </button>
      </div>
    </aside>
  );
};