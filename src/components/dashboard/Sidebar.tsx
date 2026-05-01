import Link from "next/link";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block shrink-0 min-h-screen flex flex-col">
      <div className="font-bold text-xl mb-10 text-blue-400">
        SiteMonitor Admin
      </div>

      <nav className="space-y-4 font-medium flex-grow">
        <Link
          href="/dashboard"
          className="block p-3 rounded-xl hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700"
        >
          🏠 סקירה כללית
        </Link>

        {/* הלינק המרכזי שמוביל לרשימת האתרים לניהול */}
        <Link
          href="/dashboard/sites"
          className="block p-3 rounded-xl hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700 text-blue-400"
        >
          🌐 ניהול אתרים מנוטרים
        </Link>

        {/* מחקנו את הלינק לדף הבית הציבורי - המנהל נמצא כבר בתוך הבית שלו */}
      </nav>
      <nav className="space-y-4">
        {/* מוביל לדף הרשימה/הטבלה */}
        <Link href="/dashboard/sites" className="...">
          {" "}
          🌐 ניהול אתרים{" "}
        </Link>

        {/* מוביל לדף הטופס שהעברנו עכשיו */}
        <Link href="/dashboard/sites/add" className="...">
          {" "}
          ➕ הוספת אתר{" "}
        </Link>
      </nav>
      <div className="mt-auto pt-10 border-t border-gray-800">
        <button className="flex items-center gap-2 text-red-400 text-sm hover:text-red-300 transition-colors w-full p-2">
          <span>🔒</span>
          יציאה מאובטחת
        </button>
      </div>
    </aside>
  );
};
