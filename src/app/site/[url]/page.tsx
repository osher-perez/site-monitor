"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SiteDetails() {
  const params = useParams();
  // פענוח הכתובת מה-URL
  const decodedUrl = decodeURIComponent(params.url as string);

  return (
    <div className="max-w-4xl mx-auto p-8 text-white">
      <Link href="/" className="text-blue-400 hover:underline mb-8 inline-block">
        ← חזרה ללוח הבקרה
      </Link>
      
      <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 uppercase tracking-tight">פרטי ניטור</h1>
        <p className="text-gray-400 mb-6">מציג נתונים עבור האתר:</p>
        <div className="bg-black/30 p-4 rounded-lg font-mono text-xl text-blue-300 border border-gray-600">
          {decodedUrl}
        </div>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* כאן בעתיד נמשוך נתונים אמיתיים מה-Backend */}
          <div className="bg-gray-700/50 p-6 rounded-xl">
            <h4 className="text-gray-400 text-sm mb-2">סטטוס נוכחי</h4>
            <p className="text-2xl font-bold">טוען נתונים...</p>
          </div>
        </div>
      </div>
    </div>
  );
}