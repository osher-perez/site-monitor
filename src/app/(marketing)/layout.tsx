import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-black text-blue-600 dark:text-blue-400 italic">
            SiteMonitor
          </Link>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/pricing" className="text-sm font-medium hover:text-blue-600 dark:text-slate-300 transition">
                  מחירים
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-login"
                  className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition"
                >
                  כניסת מנהל
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="grow">{children}</main>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Site Monitor - פתרונות ניטור מתקדמים</p>
      </footer>
    </div>
  );
}