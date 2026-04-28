import Link from 'next/link';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block shrink-0">
      <div className="font-bold text-xl mb-10 text-blue-400">SiteMonitor Admin</div>
      <nav className="space-y-4 font-medium">
        <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-800 transition">
          🏠 סקירה כללית
        </Link>
        <Link href="/dashboard/sites" className="block p-2 rounded hover:bg-gray-800 transition">
          🌐 האתרים שלי
        </Link>
      </nav>
      <div className="mt-auto pt-10">
         <button className="text-red-400 text-sm hover:underline">יציאה מאובטחת</button>
      </div>
    </aside>
  );
};