import React from 'react';

export const HeroSection = () => {
  return (
    <div className="text-right" dir="rtl">
      {/* Badge עליון - נקי וממוקד ב-Light Mode */}
      <span className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
        מערכת הניטור המקיפה בישראל
      </span>

      {/* כותרת ראשית מאוחדת ל-gray-950 עם גרדיאנט יוקרתי */}
      <h1 className="text-5xl md:text-6xl font-black text-gray-950 mb-6 leading-[1.15] tracking-tight">
        האתר שלך למטה? <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          תהיה הראשון לדעת.
        </span>
      </h1>

      {/* תת כותרת - מיושרת עיצובית */}
      <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto mb-2 leading-relaxed font-normal">
        ניטור אתרים מקצועי עם התראות בזמן אמת. הצטרף למאות בעלי אתרים בישראל שישנים בשקט בזמן שאנחנו שומרים על העסק שלהם.
      </p>
    </div>
  );
};