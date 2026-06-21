"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
    const userRole = getCookie("userRole"); 
    const userId = getCookie("userId");

    if (userRole === "admin" || userId === "admin") {
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
      
      {/* אזור המותג ותגית הסטטוס */}
      <div className="mb-10 px-2">
        <Link href="/dashboard" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition flex items-center gap-2">
          <span>
            Site<span className="text-gray-500 font-medium">Monitor</span>
          </span>
          <span className="text-[9px] font-mono tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">
            Console
          </span>
        </Link>
      </div>

      {/* ניווט מערכתי ללא אימוג'יז מסיחים */}
      <nav className="space-y-1.5 grow">
        
        <Link
          href="/dashboard"
          className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all border ${
            isActive("/dashboard")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          מרכז בקרה
        </Link>

        <Link
          href="/dashboard/add-site"
          className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all border ${
            isActive("/dashboard/add-site")
              ? "bg-blue-50 border-blue-100 text-blue-600"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          הוספת נקודת קצה
        </Link>

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={`flex items-center px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all border ${
              isActive("/dashboard/admin")
                ? "bg-blue-50 border-blue-100 text-blue-600"
                : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            ניהול תשתית
          </Link>
        )}

      </nav>

      {/* אזור מערכת תחתון */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
        >
          <span>ניתוק מהמערכת</span>
          <span className="text-[10px] opacity-60 font-mono">→</span>
        </button>
      </div>
    </aside>
  );
};