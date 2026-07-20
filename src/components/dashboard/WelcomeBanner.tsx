"use client";

import React from "react";

interface WelcomeBannerProps {
  name?: string;
  plan?: string;
  sitesCount?: number;
  maxLimit?: number;
}

export const WelcomeBanner = ({
  name = "משתמש",
  plan = "בסיסי (חינם)",
  sitesCount = 0,
  maxLimit = 3,
}: WelcomeBannerProps) => {
  // 🔓 פענוח קוד ה-URL במידה והשם הגיע מקודד (למשל %D7%93...)
  let decodedName = name;
  try {
    decodedName = decodeURIComponent(name);
  } catch {
    decodedName = name; // גיבוי במקרה והטקסט כבר תקין
  }

  // הגנה מפני קריסה: שליפת האות הראשונה בצורה בטוחה מהשם המפוענח
  const firstLetter =
    decodedName && decodedName.trim()
      ? decodedName.trim()[0].toUpperCase()
      : "M";

  return (
    <div
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-right"
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        {/* אווטאר אות ראשונה בעיצוב אינדיגו מקצועי */}
        <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-lg flex items-center justify-center shadow-inner font-sans">
          {firstLetter}
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-950">
            שלום, {decodedName}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            מרכז בקרה וניטור אתרים בזמן אמת
          </p>
        </div>
      </div>

      {/* מדדי חשבון וסטטוס רישוי בשפה ברורה לכולם */}
      <div className="flex items-center gap-3 text-xs">
        <span className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl font-bold">
          אתרים במעקב: {sitesCount} / {maxLimit}
        </span>
        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-xl font-black tracking-wide">
          סוג מנוי: {plan}
        </span>
      </div>
    </div>
  );
};