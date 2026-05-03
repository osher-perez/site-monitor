import React from 'react';

const features = [
  {
    icon: "🚀",
    title: "מהירות שיא",
    description: "בדיקות זמינות מ-5 מוקדים שונים בעולם בו זמנית. אנחנו מוודאים שהאתר נגיש מכל מקום."
  },
  {
    icon: "📱",
    title: "התראות וואטסאפ",
    description: "לא צריך לבדוק מיילים. קבל התראה מיידית לנייד ברגע שיש תקלה באתר כדי שתוכל לפעול מהר."
  },
  {
    icon: "🔒",
    title: "מעקב SSL",
    description: "אנחנו נזכיר לך לחדש את תעודת האבטחה לפני שהיא פוקעת ומונעים הודעות 'אתר לא מאובטח'."
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};