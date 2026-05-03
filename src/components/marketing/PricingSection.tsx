import React from 'react';

const plans = [
  {
    name: "בסיסי (חינם)",
    price: "0",
    description: "מושלם לבעלי אתרים קטנים או בלוגים אישיים",
    features: ["ניטור אתר אחד", "בדיקה כל 15 דקות", "התראות במייל", "דוח חודשי בסיסי"],
    buttonText: "התחל בחינם",
    highlight: false,
  },
  {
    name: "מקצועי (Pro)",
    price: "49",
    description: "הבחירה הפופולרית לעסקים קטנים ובינוניים",
    features: [
      "עד 10 אתרים",
      "בדיקה כל 1 דקה",
      "התראות וואטסאפ וטלגרם",
      "מעקב SSL ותוקף דומיין",
      "תמיכה מועדפת",
    ],
    buttonText: "נסה 14 יום חינם",
    highlight: true, // עיצוב מודגש
  },
  {
    name: "עסקי (Enterprise)",
    price: "199",
    description: "לסוכנויות דיגיטל ומנהלי שרתים",
    features: [
      "אתרים ללא הגבלה",
      "בדיקה כל 30 שניות",
      "גישה ל-API מלא",
      "דוחות ממותגים ללקוחות",
      "מנהל חשבון אישי",
    ],
    buttonText: "צור קשר",
    highlight: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* כותרת המדור */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            תוכניות פשוטות, בלי אותיות קטנות
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            בחר את המסלול שמתאים לך. תמיד תוכל לשדרג או לבטל.
          </p>
        </div>

        {/* כרטיסיות מחיר */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl ${
                plan.highlight 
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-600 shadow-xl scale-105 z-10' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  הכי משתלם
                </span>
              )}
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 h-10">{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8" dir="rtl">
                <span className="text-4xl font-black text-slate-900 dark:text-white">₪{plan.price}</span>
                <span className="text-slate-500 text-sm">/לחודש</span>
              </div>

              <ul className="space-y-4 mb-10 text-right" dir="rtl">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                plan.highlight 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};