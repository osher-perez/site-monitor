export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-3xl mt-10 shadow-sm" dir="rtl">
      <h1 className="text-3xl font-bold mb-6">מדיניות פרטיות</h1>
      <p className="text-gray-600 mb-4">עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}</p>
      
      <h2 className="text-xl font-bold mt-6 mb-2">איסוף מידע</h2>
      <p className="mb-4">אנו אוספים את המידע ההכרחי לתפעול השירות בלבד: אימייל, שם משתמש, וכתובות האתרים (URLs) לניטור. המידע אינו נמכר לצד שלישי.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">אבטחת מידע</h2>
      <p className="mb-4">אנו נוקטים באמצעי אבטחה מקובלים להגנה על המידע שלך. המידע נשמר בבסיסי נתונים מאובטחים.</p>

      <h2 className="text-xl font-bold mt-6 mb-2">מחיקת מידע</h2>
      <p className="mb-4">ניתן לבקש את מחיקת המידע האישי שלך בכל עת דרך פנייה למייל התמיכה שלנו.</p>
    </div>
  );
}