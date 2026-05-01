import { FreeScanner } from "@/components/marketing/FreeScanner";

export default function MarketingHomePage() {
  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6">
          האתר שלך למטה? <span className="text-blue-600">תהיה הראשון לדעת.</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
          ניטור אתרים מקצועי עם התראות בזמן אמת. הצטרף למאות בעלי אתרים בישראל שישנים בשקט.
        </p>
        
        {/* רכיב הסריקה החינמית שהפרדנו קודם */}
        <FreeScanner />
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">מהירות שיא</h3>
            <p className="text-slate-500">בדיקות זמינות מ-5 מוקדים שונים בעולם בו זמנית.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">התראות וואטסאפ</h3>
            <p className="text-slate-500">קבל התראה מיידית לנייד ברגע שיש תקלה באתר.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2">מעקב SSL</h3>
            <p className="text-slate-500">אנחנו נזכיר לך לחדש את תעודת האבטחה לפני שהיא פוקעת.</p>
          </div>
        </div>
      </div>
    </div>
  );
}