"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // פונקציית התנתקות מהירה ומאובטחת בצד הלקוח
  const handleLogout = () => {
    // מחיקת ה-cookie של המשתמש על ידי קביעת תוקף פג תוקף
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // העברה מיידית לדף הבית החיצוני
    router.push("/");
    router.refresh();
  };

  // פונקציית עזר לבדיקה איזה לינק פעיל כרגע כדי לצבוע אותו בכחול
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-white border-l border-gray-100 p-6 hidden md:flex flex-col shrink-0 min-h-screen shadow-sm text-right font-sans" dir="rtl">
      
      {/* לוגו הדשבורד - מותאם לשפה העיצובית הבהירה */}
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition">
          Site<span className="text-gray-500 font-medium">Monitor</span>
          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md mr-1.5 font-bold align-middle">פנל לניהול</span>
        </Link>
      </div>

      {/* תפריט הניווט המאוחד והנקי - ללא כפילויות וללא לינקים שבורים */}
      <nav className="space-y-1.5 flex-grow">
        
        {/* 1. לינק סקירה כללית (דף הבית של הדשבורד) */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            isActive("/dashboard")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-sm">🏠</span>
          סקירה כללית
        </Link>

        {/* 2. לינק ניהול אתרים מנוטרים (טבלה/רשימה) */}
        <Link
          href="/dashboard/sites"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            isActive("/dashboard/sites")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-sm">🌐</span>
          ניהול אתרים
        </Link>

        {/* 3. לינק ייעודי ומעוצב להוספת אתר חדש לניטור */}
        <Link
          href="/dashboard/sites/add"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all border ${
            isActive("/dashboard/sites/add")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          <span className="text-sm">➕</span>
          הוספת אתר חדש
        </Link>

      </nav>

      {/* חלק תחתון - יציאה מאובטחת מן המערכת */}
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