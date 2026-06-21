'use client';

import React, { useState } from 'react';

interface ScanResult {
  status: string;
  speed: string;
  ssl: string;
  security: string;
}

export const FreeScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsScanning(true);
    setResult(null);
    
    try {
      const response = await fetch(`http://localhost:8000/tools/quick-scan?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (response.ok) {
        setResult({
          status: data.status || 'ONLINE',
          speed: data.speed || '0.0s',
          ssl: data.ssl || 'תקין',
          security: data.security || 'A'
        });
      } else {
        setResult({
          status: 'OFFLINE',
          speed: '0.0s',
          ssl: 'שגיאה',
          security: 'F'
        });
      }
    } catch (error) {
      console.error("Scanner Error:", error);
      setResult({
        status: 'OFFLINE',
        speed: '0.0s',
        ssl: 'שגיאה בתקשורת',
        security: 'F'
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 px-4 text-right" dir="rtl">
      {/* מעטפת הסורק - Light Mode יוקרתי ונקי */}
      <div className="bg-linear-to-b from-blue-50/60 to-blue-50/10 border border-blue-100 rounded-3xl p-8 md:p-10 shadow-sm">
        
        {/* כותרת האזור */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
            אבחון זמינות ותשתית בזמן אמת
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            הזן כתובת אתר (URL) לקבלת דוח מיידי על סטטוס השרת, זמני תגובה ראשוניים ותקינות פרוטוקול ה-SSL.
          </p>
        </div>
        
        {/* טופס הסריקה */}
        <form onSubmit={handleScan} className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto">
          <input 
            type="url" 
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-left font-mono text-sm transition-all shadow-inner"
            dir="ltr"
          />
          <button 
            disabled={isScanning}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:bg-blue-400 whitespace-nowrap"
          >
            {isScanning ? 'מבצע אבחון...' : 'הפעל סריקת אבחון'}
          </button>
        </form>

        {/* אנימציית טעינה */}
        {isScanning && (
          <div className="mt-8 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-blue-600 font-bold tracking-wide">
              יוצר קשר עם שרת היעד, מנתח תגובת DNS ומודד זמני תגובה בזמן אמת...
            </p>
          </div>
        )}

        {/* תוצאות הבדיקה מהשרת */}
        {result && !isScanning && (
          <div className="mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x-0 md:divide-x md:divide-x-reverse divide-gray-100">
              
              {/* סטטוס שרת */}
              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">סטטוס שרת</div>
                <div className={`font-extrabold text-sm flex items-center justify-center gap-1.5 ${result.status === 'ONLINE' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {result.status === 'ONLINE' && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                  )}
                  {result.status}
                </div>
              </div>

              {/* זמן תגובה */}
              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">זמן תגובה</div>
                <div className="font-extrabold text-sm text-gray-900 font-mono">{result.speed}</div>
              </div>

              {/* תעודת SSL */}
              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">תעודת SSL</div>
                <div className={`font-extrabold text-sm ${result.ssl.includes('תקף') || result.ssl.includes('תקין') ? 'text-blue-600' : 'text-amber-600'}`}>{result.ssl}</div>
              </div>

              {/* ציון אבטחה */}
              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ציון אבטחה</div>
                <div className={`font-extrabold text-sm ${result.security.startsWith('A') ? 'text-purple-600' : 'text-red-500'}`}>{result.security}</div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};