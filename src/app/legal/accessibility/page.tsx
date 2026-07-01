export default function AccessibilityStatement() {
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl mt-10 shadow-sm" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">הצהרת נגישות</h1>
      <p className="text-gray-600 mb-4">עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>
      
      <h2 className="text-xl font-bold mt-6 mb-2">נגישות האתר</h2>
      <p className="mb-4">אנו מאמינים שאינטרנט צריך להיות נגיש לכולם. אתר זה נבנה עם דגש על נוחות שימוש וניווט מקלדת.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">יצירת קשר עם רכז נגישות</h2>
      <p className="mb-4">במידה ונתקלת בבעיה בנגישות האתר, נשמח אם תפנה אלינו למייל התמיכה שלנו ונתקן זאת בהקדם האפשרי.</p>
      <p className="font-bold">מייל: support@sitemonitor.co.il</p>
    </div>
  );
}