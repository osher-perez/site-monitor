import React from 'react';

const features = [
  {
    icon: "🚀",
    title: "מהירות שיא",
    description: "בדיקות זמינות מ-5 מוקדים שונים בעולם בו זמנית. אנחנו מוודאים שהאתר נגיש ומגיב מהר מכל מקום."
  },
  {
    icon: "📱",
    title: "התראות WhatsApp",
    description: "לא צריך לרדוף אחרי מיילים. קבל התראה מיידית ישירות לנייד ברגע שיש תקלה באתר כדי שתוכל לפעול מיד."
  },
  {
    icon: "🔒",
    title: "מעקב SSL מתקדם",
    description: "אנחנו נזהיר אותך לחדש את תעודת האבטחה לפני שהיא פוקעת ונמנע מהגולשים שלך הודעות שגיאה מביכות."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* כותרת קטנה ומזקקת מעל הגריד */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            כל מה שצריך כדי לשמור על האתר באוויר
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-400 font-medium">
            כלי ניטור מתקדמים, התראות בזמן אמת וממשק אחד פשוט שעובד בשבילך 24/7.
          </p>
        </div>

        {/* הגריד של הכרטיסיות - נקי, בהיר ויוקרתי */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
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
    </section>
  );
};