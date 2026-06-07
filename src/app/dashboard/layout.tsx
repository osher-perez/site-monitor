import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    // רקע אפור-גל בהיר וחלק ביותר, וטקסט כהה ומקצועי
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      
      {/* התפריט הצדדי - יוצג בצד ימין */}
      <Sidebar />
      
      {/* אזור התוכן המרכזי והבר העליון */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* הבר העליון (Header) - מעוצב בסגנון לבן ונקי */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shadow-sm">
          <div className="font-black tracking-tight text-gray-700 uppercase text-sm">
            פאנל ניטור אתרים – ניהול מערכת
          </div>
          
          {/* נורית חיווי ירוקה שהמערכת מחוברת ועובדת בזמן אמת */}
          <div className="flex items-center gap-3 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-emerald-700 font-mono font-bold tracking-wide">LIVE MONITORING</span>
          </div>
        </header>

        {/* הדפים הפנימיים יוזרקו כאן בפנים על רקע בהיר */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}