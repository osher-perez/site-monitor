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
      
      {/* כותרת קודקת ומהודקת */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-3">
          יכולות הליבה
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
          תשתית פרואקטיבית לזמינות האתר
        </h2>
        <p className="mt-2 max-w-xl mx-auto text-sm text-gray-600 font-medium">
          ניטור רציף, התראות מיידיות וממשק ניהול אחיד הפועל ברקע 24/7.
        </p>
      </div>

      {/* גריד כרטיסיות מודרני עם מרווחים קומפקטיים */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="group relative p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            {/* אייקון בתוך עיגול מעוצב */}
            <div className="w-12 h-12 mb-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
              {feature.icon}
            </div>
            
            {/* כותרת הפיצ'ר */}
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            
            {/* תיאור הפיצ'ר */}
            <p className="text-gray-600 text-sm leading-relaxed font-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};