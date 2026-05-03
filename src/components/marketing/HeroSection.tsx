import React from 'react';
import { FreeScanner } from "./FreeScanner";

export const HeroSection = () => {
  return (
    <section className="mb-16">
      {/* Badge עליון */}
      <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-600 uppercase bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
        מערכת הניטור המקיפה בישראל
      </span>

      {/* כותרת ראשית עם גרדיאנט */}
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[1.1]">
        האתר שלך למטה? <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          תהיה הראשון לדעת.
        </span>
      </h1>

      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
        ניטור אתרים מקצועי עם התראות בזמן אמת. הצטרף למאות בעלי אתרים בישראל שישנים בשקט בזמן שאנחנו שומרים על העסק שלהם.
      </p>
      
      {/* רכיב הסריקה החינמית */}
      <div className="mb-24">
        <FreeScanner />
      </div>
    </section>
  );
};