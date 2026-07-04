"use client";

interface HistoryLog {
  timestamp: string;
  status: string;
  response_time: number;
}

interface SiteAnalyticsGraphProps {
  history: HistoryLog[];
}

export function SiteAnalyticsGraph({ history }: SiteAnalyticsGraphProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-6">מהירות תגובת שרת בבדיקות האחרונות (במילישניות)</h3>
      
      <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100 font-mono">
        {history.slice(-12).map((log, index) => {
          const heightPercentage = Math.min((log.response_time / 2000) * 100, 100);
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div className="absolute bottom-full mb-2 bg-gray-950 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap border border-gray-800 shadow-md">
                {log.response_time} ms ({new Date(log.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })})
              </div>
              
              <div 
                style={{ height: `${heightPercentage || 5}%` }} 
                className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${
                  log.status === "UP" ? "bg-indigo-500" : "bg-rose-500"
                }`}
              />
              
              <span className="text-[9px] text-gray-400 mt-2 block tracking-tighter">
                {new Date(log.timestamp).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}