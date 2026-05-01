import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiteMonitor",
  description: "מערכת ניטור אתרים",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      {/* שים לב: הורדנו את ה-Header וה-Link מכאן! */}
      <body className="antialiased bg-white dark:bg-slate-900 transition-colors duration-300">
        <main>{children}</main>
      </body>
    </html>
  );
}