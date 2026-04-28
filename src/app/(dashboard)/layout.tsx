import { ReactNode } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /> {/* התפריט הצדדי שהוצאנו למחסן */}
      
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <div className="font-semibold text-gray-500">פאנל ניהול</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-xs text-gray-400 font-medium">מחובר</span>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}