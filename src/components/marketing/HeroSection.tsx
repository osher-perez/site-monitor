import React from 'react';

export const HeroSection = () => {
  return (
    <div className="text-right" dir="rtl">
      {/* Badge עליון - נקי וממוקד ב-Light Mode */}
      <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
        ניטור זמינות ותשתית בזמן אמת
      </span>

      {/* כותרת ראשית מאוחדת ל-gray-950 עם גרדיאנט יוקרתי */}
      <h1 className="text-5xl md:text-6xl font-black text-gray-950 mb-6 leading-[1.15] tracking-tight">
        רציפות דיגיטלית קריטית. <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
          תמיד בבקרה מלאה.
        </span>
      </h1>

      {/* תת כותרת - מיושרת עיצובית ואלגנטית */}
      <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-2 leading-relaxed font-normal">
        פלטפורמת ניטור מבוזרת המבצעת אימות זמינות רציף ומספקת התראות מיידיות. הגנה היקפית על הנכסים הדיגיטליים של העסק שלך, 24/7.
      </p>
    </div>
  );
};