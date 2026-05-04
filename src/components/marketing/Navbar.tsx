import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between" dir="rtl">
        
        {/* לוגו */}
        <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
          <span className="text-2xl">🌐</span>
          SiteMonitor
        </div>
        
        {/* ניווט חכם - שים לב ל-/# */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">בית</Link>
          <Link href="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition">יתרונות</Link>
          <Link href="/#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">מחירים</Link>
          <Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition">מאמרים</Link>
        </nav>

        {/* כפתורי פעולה */}
        <div className="flex gap-4">
          <Link href="/admin-login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 self-center hidden sm:block">
            כניסת מנהל
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95">
            התחל עכשיו
          </button>
        </div>
      </div>
    </header>
  );
};