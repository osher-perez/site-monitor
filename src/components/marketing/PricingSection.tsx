import React from 'react';

const plans = [
  {
    name: "Free Trial",
    price: "0",
    description: "אבחון ראשוני והתנסות ביכולות המערכת",
    features: [
      "ניטור של עד 3 אתרים במקביל",
      "בדיקת זמינות מחזורית",
      "דיווחים והתראות קצה במייל",
      "גישה מלאה למרכז הבקרה למשך 3 ימים",
    ],
    buttonText: "הפעלת תקופת ניסיון",
    highlight: false,
  },
  {
    name: "Professional (Pro)",
    price: "49",
    description: "ניטור תשתית מקיף לעסקים וחברות",
    features: [
      "ניטור מורחב של עד 10 אתרים",
      "תדירות בדיקה גבוהה (כל דקה)",
      "התראות ערוץ ישיר (WhatsApp & Telegram)",
      "מעקב רציף אחר תעודות SSL ותוקף דומיין",
      "תעדוף קריאות ותמיכה מועדפת",
    ],
    buttonText: "יצירת חשבון Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "התאמה אישית",
    description: "פתרונות מותאמים אישית לארגונים וסוכנויות דיגיטל",
    features: [
      "ניטור נפח אתרים ללא הגבלה",
      "אימות זמינות קריטי (כל 30 שניות)",
      "גישה מלאה ל-API של המערכת",
      "הפקת דוחות ביצועים ממותגים (White-Label)",
      "מנהל פרויקט וחשבון ייעודי",
    ],
    buttonText: "התאמת פתרון ארגוני",
    highlight: false,
  },
];

export const PricingSection = () => {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* כותרת המדור */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            מודל רישוי גמיש ומותאם
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            בחר את רמת הניטור הנדרשת עבור הארגון שלך. ניתן לשנות או לשדרג מסלול בכל עת.
          </p>
        </div>

        {/* כרטיסיות מחיר */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl flex flex-col justify-between ${
                plan.highlight
                  ? "bg-blue-50 dark:bg-blue-900/10 border-blue-600 shadow-xl scale-105 z-10"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Pro Track
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-400 mb-6 min-h-8 leading-relaxed font-medium">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8" dir="rtl">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {plan.price !== "התאמה אישית" ? `₪${plan.price}` : plan.price}
                  </span>
                  {plan.price !== "התאמה אישית" && (
                    <span className="text-slate-400 text-xs font-medium">/לחודש</span>
                  )}
                </div>

                <ul className="space-y-4 mb-10 text-right" dir="rtl">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs font-normal leading-normal"
                    >
                      <span className="shrink-0 w-4 h-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  plan.highlight
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-[0.98]"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};