export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl mt-10 shadow-sm" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">תנאי שימוש</h1>
      <p className="text-gray-600 mb-4">עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>
      
      <h2 className="text-xl font-bold mt-6 mb-2">1. קבלת התנאים</h2>
      <p className="mb-4">השימוש באתר זה מהווה הסכמה מלאה לתנאים הבאים.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">2. הגבלת אחריות (AS-IS)</h2>
      <p className="mb-4">השירות מסופק "כמות שהוא". איננו מתחייבים לדיוק מלא של נתוני הניטור. השימוש במידע הוא באחריות המשתמש בלבד, ואיננו אחראים לכל נזק שייגרם כתוצאה משימוש בשירות.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">3. שימוש מותר</h2>
      <p className="mb-4">המשתמש מצהיר כי יש לו את הסמכות לנטר את האתרים המוזנים במערכת. חל איסור על שימוש בשירות לצורך תקיפה, עומס מכוון, או כל פעילות בלתי חוקית.</p>
    </div>
  );
}