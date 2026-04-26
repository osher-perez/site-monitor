import { ReactNode } from 'react';

export const metadata = {
  title: 'Dashboard | Site Monitor',
  // אנחנו אומרים לגוגל: "אל תאנדקס את האזור הזה"
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar - רק למנהל/משתמש רשום */}
      <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <div className="font-bold text-xl mb-10 text-blue-400">Admin Panel</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-blue-400 transition">סקירה כללית</a>
          <a href="/dashboard/sites" className="block hover:text-blue-400 transition">האתרים שלי</a>
          <a href="/dashboard/logs" className="block hover:text-blue-400 transition">יומן התראות</a>
          <a href="/dashboard/settings" className="block hover:text-blue-400 transition">הגדרות</a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h2 className="font-semibold italic text-gray-500">מערכת ניהול פנימית</h2>
          <div className="flex items-center gap-4">
             <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">מחובר</span>
             <button className="text-sm text-red-500 font-medium">התנתק</button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}