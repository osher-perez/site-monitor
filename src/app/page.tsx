export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Site Monitor</h1>
      <p className="text-gray-400">המערכת שלי לניטור אתרים - ברוכים הבאים!</p>
      
      <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
        <p>סטטוס המערכת: <span className="text-green-400 font-mono italic">מחובר ומוכן לעבודה</span></p>
      </div>
    </div>
  );
}