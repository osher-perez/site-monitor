export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ברוך הבא, מנהל</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-1">אתרים בניטור</p>
          <p className="text-4xl font-black">12</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-1">נפילות ב-24 שעות</p>
          <p className="text-4xl font-black text-red-500">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 mb-1">זמן תגובה ממוצע</p>
          <p className="text-4xl font-black text-green-500">240ms</p>
        </div>
      </div>
      
      {/* כאן בהמשך נחבר את רשימת האתרים האמיתית מה-DB */}
      <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[300px] flex items-center justify-center text-gray-400 italic">
        כאן תוצג טבלת הניטור המקצועית שלך...
      </div>
    </div>
  );
}