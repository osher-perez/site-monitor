import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased bg-gray-900 text-white flex flex-col min-h-screen">
        <header className="bg-gray-800 border-b border-gray-700 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-400">SiteMonitor</h1>
            <nav>
              <ul className="flex gap-4">
                <li>
                  <Link href="/" className="hover:text-blue-400 transition">
                    דף הבית
                  </Link>
                  <li>
                    <Link
                      href="/add-site"
                      className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded transition text-sm"
                    >
                      + הוספת אתר
                    </Link>
                  </li>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="grow container mx-auto p-6">{children}</main>

        <footer className="bg-gray-800 border-t border-gray-700 p-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Site Monitor - כל הזכויות שמורות</p>
        </footer>
      </body>
    </html>
  );
}
