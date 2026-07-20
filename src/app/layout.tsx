"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// פונקציית עזר לשליפת קוקי בצד הלקוח
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function RootLayout({
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
    <html lang="he" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-white text-gray-900 font-sans">
        
        {/* ה-Navbar העליון */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center px-4">
            <Link href="/" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition">
              Site<span className="text-gray-500 font-medium">Monitor</span>
            </Link>
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

        {/* תוכן העמודים */}
        <main className="grow">{children}</main>

        {/* פוטר */}
        <Footer />
      </body>
    </html>
  );
}