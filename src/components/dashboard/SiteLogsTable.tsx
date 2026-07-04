"use client";

interface HistoryLog {
  timestamp: string;
  status: string;
  response_time: number;
}

interface SiteLogsTableProps {
  history: HistoryLog[];
}

export function SiteLogsTable({ history }: SiteLogsTableProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">יומן בדיקות מפורט (לוגים)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400">
              <th className="p-4 font-bold uppercase">זמן בדיקה</th>
              <th className="p-4 font-bold uppercase text-center">סטטוס</th>
              <th className="p-4 font-bold uppercase text-left">זמן תגובה</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                <td className="p-4 text-gray-600" dir="ltr" style={{ textAlign: "right" }}>
                  {new Date(log.timestamp).toLocaleString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === "UP" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                  }`}>
                    {log.status === "UP" ? "ONLINE" : "OFFLINE"}
                  </span>
                </td>
                <td className="p-4 text-left font-bold text-gray-700">
                  {log.response_time} ms
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">
                  אין נתוני היסטוריה זמינים עבור אתר זה עדיין.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}