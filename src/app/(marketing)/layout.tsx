"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// פונקציית עזר לשליפת קוקי בצד הלקוח
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [buttonConfig, setButtonConfig] = useState({
    label: "כניסה למערכת",
    href: "/auth",
  });

  useEffect(() => {
    const userId = getCookie("userId");
    const userRole = getCookie("userRole");

    // מניעת זליגה: אם המשתמש כבר מחובר, נשנה את הכפתור ליעד הרלוונטי עבורו
    if (userId) {
      if (userRole === "admin" || userId === "admin") {
        setButtonConfig({
          label: "🛡️ פנל ניהול (Admin)",
          href: "/admin-panel",
        });
      } else {
        setButtonConfig({
          label: "הדשבורד שלי ←",
          href: "/dashboard",
        });
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans" dir="rtl">
      
      {/* ה-Navbar העליון - נקי, מאובטח ומותאם אישית */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          
          {/* לוגו האתר (פונה שמאלה בגלל ה-RTL) */}
          <Link href="/" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition">
            Site<span className="text-gray-500 font-medium">Monitor</span>
          </Link>
          
          {/* תפריט הניווט - כפתור חכם ודינמי */}
          <nav>
            <Link
              href={buttonConfig.href}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition shadow-sm active:scale-95 inline-block"
            >
              {buttonConfig.label}
            </Link>
          </nav>
        </div>
      </header>

      {/* עמודי השיווק החיצוניים יוזרקו כאן */}
      <main className="grow">{children}</main>

      {/* הפוטר התחתון */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8 text-center text-xs font-mono text-gray-400 tracking-tight">
        <p>© {new Date().getFullYear()} SITEMONITOR. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}