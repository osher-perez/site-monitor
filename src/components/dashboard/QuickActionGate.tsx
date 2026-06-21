"use client";

// ✅ תיקון השגיאה: החזרת ה-Import הנכון עבור קומפוננטת הניווט של Next.js
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
        {/* כותרת ניהולית וסמכותית */}
        <h2 className="text-lg font-black tracking-tight text-gray-950">
          מעקב וניהול כתובות
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          נקודות קצה פעילות באימות רציף
        </p>
      </div>

      {isLimitReached ? (
        <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl text-amber-700 font-bold text-xs shadow-2xs font-mono">
          🔒 ניצול מכסה מלא: חבילת Trial (3/3 אתרים)
        </div>
      ) : (
        <Link
          href={isImpersonating ? `/dashboard/add-site?userId=${viewAsId}` : "/dashboard/add-site"}
          className="bg-gray-950 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          + הוספת נקודת קצה
        </Link>
      )}
    </div>
  );
};