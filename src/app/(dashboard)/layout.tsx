import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    // שינוי הרקע לכהה אחיד שמתאים ל-globals.css
    <div className="flex min-h-screen bg-black text-white font-sans">
      {/* התפריט הצדדי - יוצג קבוע בצד ימין (מותאם ל-RTL) */}
      <Sidebar />
      
      {/* אזור התוכן המרכזי והבר העליון */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* הבר העליון (Header) - מעוצב בסגנון כהה ונקי */}
        <header className="h-16 bg-zinc-950 border-b border-zinc-900 flex items-center px-8 justify-between">
          <div className="font-black tracking-tight text-zinc-400 uppercase text-sm">
            פאנל ניטור אתרים
          </div>
          
          {/* נורית חיווי ירוקה שהמערכת מחוברת ועובדת בזמן אמת */}
          <div className="flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-zinc-400 font-mono font-medium tracking-wide">LIVE MONITORING</span>
          </div>
        </header>

        {/* הדפים הפנימיים יוזרקו כאן בפנים */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}