"use client";

import Link from "next/link";

interface QuickActionGateProps {
  isLimitReached: boolean;
  isImpersonating: boolean;
  viewAsId: string | null;
}

export const QuickActionGate = ({ isLimitReached, isImpersonating, viewAsId }: QuickActionGateProps) => {
  return (
    <div className="flex justify-between items-center border-t border-gray-100 pt-6 text-right" dir="rtl">
      <div>
        <h2 className="text-lg font-black tracking-tight text-gray-950">האתרים המנוטרים שלי</h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">רשימת האתרים הפעילים שנבדקים בזמן אמת</p>
      </div>

      {isLimitReached ? (
        <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl text-amber-700 font-bold text-xs shadow-2xs">
          🔒 הגעת למגבלת המכסה החינמית (3 אתרים)
        </div>
      ) : (
        /* 🛡️ וידוא קשיח: אם אדמין מוסיף, האתר מתווסף במדויק על הלקוח המנוהל הנוכחי */
        <Link
          href={isImpersonating ? `/dashboard/add-site?userId=${viewAsId}` : "/dashboard/add-site"}
          className="bg-gray-950 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95"
        >
          + הוסף אתר לניטור
        </Link>
      )}
    </div>
  );
};