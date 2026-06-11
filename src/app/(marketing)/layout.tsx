import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      
      {/* ה-Navbar העליון - מעודכן ומזוקק */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-50 transition-all">
        <div className="container mx-auto flex justify-between items-center px-4">
          
          {/* לוגו האתר */}
          <Link href="/" className="text-xl font-black tracking-tighter uppercase text-blue-600 hover:opacity-80 transition">
            Site<span className="text-gray-500 font-medium">Monitor</span>
          </Link>
          
          {/* תפריט הניווט - מכיל רק את כפתור הכניסה המאוחד */}
          <nav>
            <ul className="flex items-center gap-6">
              
              
              {/* הכפתור המאוחד והיחיד - מוביל לנתיב ה-auth החדש שבו נשים את תיבת המייל החכמה */}
              <li>
                <Link
                  href="/auth"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition shadow-md active:scale-95"
                >
                  כניסה למערכת
                </Link>
              </li>
            </ul>
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