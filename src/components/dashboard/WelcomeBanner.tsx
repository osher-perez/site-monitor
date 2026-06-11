"use client";

interface WelcomeBannerProps {
  name: string;
  plan: string;
  sitesCount: number;
  maxLimit: number;
}

export const WelcomeBanner = ({ name, plan, sitesCount, maxLimit }: WelcomeBannerProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-right" dir="rtl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-black text-lg flex items-center justify-center shadow-inner">
          {name[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-950">שלום, {name}</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">ברוך הבא למרכז הבקרה האישי שלך</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1.5 rounded-xl font-mono text-xs font-bold">
          📊 ניצולת: {sitesCount}/{maxLimit} אתרים
        </span>
        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wide">
          👑 מסלול: {plan || "בסיסי (חינם)"}
        </span>
      </div>
    </div>
  );
};