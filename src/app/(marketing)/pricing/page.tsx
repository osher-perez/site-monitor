import React from 'react';
import { FreeScanner } from '@/components/marketing/FreeScanner';

export const metadata = {
  title: 'ניטור אתרים - חבילות ומחירים | בדיקת אתר חינם',
  description: 'גלה תוך שניות אם האתר שלך מאובטח ומהיר. ניטור אתרים מקצועי עם התראות וואטסאפ.',
};

export default function PricingPage() {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          אל תחכה שהלקוחות יגידו לך שהאתר למטה
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          מערכת הניטור המקיפה בישראל. בדוק את האתר שלך עכשיו בחינם וקבל דו&quot;ח זמינות, מהירות ואבטחה תוך שניות.
        </p>
      </div>

      {/* הרכיב האינטראקטיבי של הסורק */}
      <FreeScanner />

      {/* כותרת למחירון */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white underline decoration-blue-500 underline-offset-8">
          בחר את המסלול המתאים לך
        </h2>
      </div>

      {/* Pricing Cards Section */}
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        
        {/* Professional Plan */}
        <div className="bg-white dark:bg-slate-800 border-2 border-blue-500 rounded-3xl p-10 shadow-2xl relative flex flex-col transform hover:-translate-y-1 transition-all">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-1 rounded-b-xl text-sm font-bold tracking-wide">
            הבחירה הנפוצה
          </div>
          
          <div className="mb-8 text-right">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Professional</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic">כל מה שצריך כדי לישון בשקט</p>
          </div>

          <div className="mb-8 text-right">
            <span className="text-6xl font-black text-slate-900 dark:text-white">₪49</span>
            <span className="text-slate-400 text-lg"> / חודש</span>
          </div>
          
          <ul className="space-y-5 mb-10 flex-grow text-right" dir="rtl">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span>ניטור רציף כל 60 שניות</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-bold">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span>התראות בוואטסאפ, SMS ומייל</span>
            </li>
            <li className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span>7 ימי ניסיון חינם - ללא התחייבות</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <span className="text-green-500 font-bold text-xl">✓</span>
              <span>דוחות ביצועים למייל</span>
            </li>
          </ul>

          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none">
            התחל שבוע ניסיון חינם
          </button>
        </div>

        {/* Agency Plan */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col transition-all">
          <div className="mb-8 text-right">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Agency</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">ניהול מקצועי לצי אתרים</p>
          </div>

          <div className="mb-8 text-right">
            <span className="text-6xl font-black text-slate-900 dark:text-white">₪149</span>
            <span className="text-slate-400 text-lg"> / חודש</span>
          </div>
          
          <ul className="space-y-5 mb-10 flex-grow text-right" dir="rtl">
            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="text-slate-400 font-bold text-xl">✓</span>
              <span>עד 50 אתרים במקביל</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="text-slate-400 font-bold text-xl">✓</span>
              <span>דוחות White Label ללקוחות שלך</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="text-slate-400 font-bold text-xl">✓</span>
              <span>בדיקה מ-5 מיקומים בעולם</span>
            </li>
            <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <span className="text-slate-400 font-bold text-xl">✓</span>
              <span>תמיכה אישית ב-Slack/טלפון</span>
            </li>
          </ul>

          <button className="w-full border-2 border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white py-5 rounded-2xl font-bold text-xl hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition">
            צור קשר עם המכירות
          </button>
        </div>

      </div>

      <p className="text-center mt-12 text-slate-400 text-sm">
        מאובטח בטכנולוגיית 256-bit SSL. אין צורך בכרטיס אשראי לבדיקה החינמית.
      </p>
    </div>
  );
}