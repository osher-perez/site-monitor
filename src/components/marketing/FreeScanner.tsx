"use client";

import { useState } from "react";
import { checkSiteAction } from "@/app/actions/check-site";

export const FreeScanner = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 1. הפונקציה הזו צריכה להיות כאן, גלויה לכל הקומפוננטה
  const getSpeedColor = (ms: number) => {
    if (ms < 300) return "text-green-500"; 
    if (ms < 800) return "text-yellow-500"; 
    return "text-red-500"; 
  };

  const handleScan = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);

    const data = await checkSiteAction(url);
    
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="flex gap-2">
        <input 
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="הכנס כתובת אתר..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none"
        />
        <button 
          onClick={handleScan}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {loading ? "בודק..." : "סרוק עכשיו"}
        </button>
      </div>

      {result && result.success && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 mb-1">סטטוס</p>
            <div className="text-xl font-bold text-green-600 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              מחובר
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 mb-1">מהירות תגובה</p>
            <div className={`text-xl font-bold ${getSpeedColor(result.responseTime)}`}>
              {result.responseTime}ms
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 mb-1">אבטחה</p>
            <div className={`text-xl font-bold ${result.isHttps ? "text-blue-600" : "text-orange-500"}`}>
              {result.isHttps ? "🔒 HTTPS" : "🔓 HTTP"}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};