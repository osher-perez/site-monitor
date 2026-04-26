import React from 'react';

export const metadata = {
  title: 'חבילות ומחירים',
  description: 'הצטרפו לניטור אתרים מקצועי. התחילו בבדיקה חינם ועברו לניטור רציף עם שבוע ניסיון.',
};

export default function PricingPage() {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          שקיפות מלאה, בלי הפתעות
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          בחר את המסלול שמתאים לעסק שלך. התחל בבדיקה ידנית מהירה כדי לראות אותנו בפעולה.
        </p>
      </div>

      {/* The Hook: Manual Scan Area */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-8 mb-20 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">רוצה לטעום? בדוק אתר עכשיו</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input 
            type="url" 
            placeholder="הכנס כתובת אתר (https://example.com)"
            className="flex-1 px-4 py-3 rounded-xl border-none ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
            הרץ בדיקה חינם
          </button>
        </div>
        <p className="mt-4 text-sm text-blue-700">
          * בדיקה חד-פעמית הכוללת מהירות טעינה וסטטוס שרת.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Professional Plan */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl text-sm font-bold">
            מומלץ לעסקים
          </div>
          <h3 className="text-2xl font-bold mb-2">Professional</h3>
          <p className="text-gray-500 mb-6 font-medium">כל מה שצריך כדי לישון בשקט</p>
          <div className="text-5xl font-black mb-6">₪49 <span className="text-lg font-normal text-gray-400">/חודש</span></div>
          
          <ul className="space-y-4 mb-10 flex-grow text-right">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> ניטור רציף כל 60 שניות
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> התראות בוואטסאפ ובמייל
            </li>
            <li className="flex items-center gap-2 font-bold text-blue-600">
              <span className="text-green-500">✔</span> 7 ימי ניסיון חינם
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> דוחות ביצועים שבועיים
            </li>
          </ul>

          <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition">
            התחל שבוע ניסיון חינם
          </button>
        </div>

        {/* Agency Plan */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col">
          <h3 className="text-2xl font-bold mb-2">Agency</h3>
          <p className="text-gray-500 mb-6">לניהול צי אתרים ולקוחות</p>
          <div className="text-5xl font-black mb-6">₪149 <span className="text-lg font-normal text-gray-400">/חודש</span></div>
          
          <ul className="space-y-4 mb-10 flex-grow text-right">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> עד 50 אתרים במקביל
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> דוחות ממותגים (White Label)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> API פתוח למפתחים
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✔</span> תמיכה טלפונית אישית
            </li>
          </ul>

          <button className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition">
            צור קשר עם מכירות
          </button>
        </div>

      </div>
    </div>
  );
}