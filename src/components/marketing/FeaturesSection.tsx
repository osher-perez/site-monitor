import React from 'react';

const features = [
  {
    icon: "🚀",
    title: "ניטור רב-מוקדי",
    description: "אימות זמינות וזמני תגובה מ-5 נקודות קצה גלובליות במקביל, להבטחת חוויית משתמש רציפה בכל העולם."
  },
  {
    icon: "📱",
    title: "התראות ערוץ ישיר",
    description: "דיווחים מיידיים ישירות ל-WhatsApp ברגע זיהוי חריגה, המאפשרים תגובה וטיפול מהיר ללא תלות בתיבת המייל."
  },
  {
    icon: "🔒",
    title: "ניטור תעודות SSL",
    description: "מעקב מונע והתרעות לפני פקיעת תוקף של תעודות אבטחה, למניעת חסימת משתמשים ושמירה על רצף האבטחה."
  }
];

export const FeaturesSection = () => {
  return (
    <div id="features" className="text-right" dir="rtl">
      
      {/* כותרת קטנה ומזקקת מעל הגריד */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          תשתית פרואקטיבית לזמינות האתר
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-400 font-medium">
          ניטור רציף, התראות מיידיות וממשק ניהול אחיד הפועל ברקע 24/7.
        </p>
      </div>

      {/* הגריד של הכרטיסיות - נקי, בהיר ויוקרתי */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-98"
          >
            {/* האייקון עם האנימציה הדינמית */}
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
              {feature.icon}
            </div>
            
            {/* כותרת הפיצ'ר */}
            <h3 className="text-lg font-bold text-gray-950 mb-2 font-sans">
              {feature.title}
            </h3>
            
            {/* תיאור הפיצ'ר */}
            <p className="text-gray-500 text-xs leading-relaxed font-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};