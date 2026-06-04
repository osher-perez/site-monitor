import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // ייבוא פונטים מודרניים מובנים
import "./globals.css";

// הגדרת פונט Sans (לטקסט רגיל)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// הגדרת פונט Mono (למספרים, מהירות, זמנים וכתובות URL)
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SiteMonitor",
  description: "מערכת ניטור אתרים מתקדמת בזמן אמת",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* הסרנו את bg-white ו-dark:bg-slate-900 שהתנגשו עם ה-CSS הגלובלי.
        כעת הצבעים נשלטים ב-100% מתוך globals.css בצורה יציבה ומקצועית!
      */}
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}