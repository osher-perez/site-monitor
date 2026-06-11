"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// פונקציית עזר קטנה לשליפת קוקי בצד הלקוח
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // בדיקה האם המשתמש המחובר הוא אדמין (לפי קוקיז או יוזר ספציפי)
    const userRole = getCookie("userRole"); 
    const userId = getCookie("userId");

    // הגנה: אם התפקיד הוא admin, או שמזהה המשתמש הוא מזהה האדמין המוגדר שלך
    if (userRole === "admin" || userId === "admin") {
      // עטיפה ב-setTimeout כדי למנוע קריאה סינכרונית ישירה בתוך האפקט
      setTimeout(() => {
        setIsAdmin(true);
      }, 0);
    }
  }, []);

  const handleLogout = () => {
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-l border-gray-100 p-6 hidden md:flex flex-col shrink-0 min-h-screen shadow-sm text-right font-sans" dir="rtl">
      
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition">
          Site<span className="text-gray-500 font-medium">Monitor</span>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md mr-1.5 font-bold align-middle">פנל ניהול</span>
        </Link>
      </div>

      <nav className="space-y-1.5 grow">
        
        {/* לינק קבוע לכולם: האתרים שלי */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            isActive("/dashboard")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-sm">🏠</span>
          האתרים שלי
        </Link>

        {/* לינק קבוע לכולם: הוספת אתר חדש */}
        <Link
          href="/dashboard/add-site"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            isActive("/dashboard/add-site")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-sm">➕</span>
          הוספת אתר חדש
        </Link>

        {/* 🔒 לינק מוגן: יוצג אך ורק אם המשתמש המחובר זוהה כמנהל מערכת */}
        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
              isActive("/dashboard/admin")
                ? "bg-blue-50 border-blue-100 text-blue-600"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-sm">🛡️</span>
            ניהול מערכת (Admin)
          </Link>
        )}

      </nav>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
        >
          <span className="text-sm">🔒</span>
          יציאה מאובטחת
        </button>
      </div>
    </aside>
  );
};  