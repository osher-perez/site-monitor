'use client';

import React, { useState } from 'react';

export const FreeScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    
    // סימולציה של 3 שניות לבדיקה
    setTimeout(() => {
      setResult({
        status: 'online',
        speed: '0.8s',
        ssl: 'Valid',
        security: 'A+'
      });
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-20">
      <div className="bg-blue-50 dark:bg-slate-800 border-2 border-blue-100 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2">בדיקת אבחון מהירה (Free Scan)</h2>
          <p className="text-blue-700 dark:text-blue-300">הזן כתובת אתר לבדיקת סטטוס, מהירות ותקינות SSL</p>
        </div>
        
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
          <input 
            type="url" 
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-6 py-4 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none text-left transition-all"
            dir="ltr"
          />
          <button 
            disabled={isScanning}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:bg-blue-400 active:scale-95 whitespace-nowrap"
          >
            {isScanning ? 'סורק נתונים...' : 'הרז בדיקת מומחה'}
          </button>
        </form>

        {/* אנימציית טעינה */}
        {isScanning && (
          <div className="mt-8 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">מנתח אבטחת SSL וזמני תגובה...</p>
          </div>
        )}

        {/* תוצאות הבדיקה */}
        {result && !isScanning && (
          <div className="mt-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-green-500 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">סטטוס שרת</div>
                <div className="font-bold text-green-600">ONLINE</div>
              </div>
              <div className="text-center p-3 border-r dark:border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">זמן תגובה</div>
                <div className="font-bold dark:text-white">{result.speed}</div>
              </div>
              <div className="text-center p-3 border-r dark:border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">תעודת SSL</div>
                <div className="font-bold text-blue-500">{result.ssl}</div>
              </div>
              <div className="text-center p-3 border-r dark:border-slate-800">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">ציון אבטחה</div>
                <div className="font-bold text-purple-500">{result.security}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};