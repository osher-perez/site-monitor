"use client";

import React, { useState } from "react";

interface HeadersAnalysis {
  "X-Frame-Options": boolean;
  "Strict-Transport-Security": boolean;
  "X-Content-Type-Options": boolean;
}

interface ScanResult {
  realtime: {
    url: string;
    status: string;
    httpCode: number;
    speed: string;
    sslStatus: string;
    securityRating: string;
    headersAnalysis: HeadersAnalysis;
  };
  premiumLocked: {
    historicalUptimeSla: string;
    loadVarianceGraph: string;
    instantChannelsAlerting: string;
  };
}

export const FreeScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // ניקוי והתאמת פרוטוקול במידה והמשתמש לא הזין https
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch(`/api/quick-scan?url=${encodeURIComponent(formattedUrl)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          realtime: {
            url: data.realtime_data.url,
            status: data.realtime_data.status,
            httpCode: data.realtime_data.http_code,
            speed: data.realtime_data.speed,
            sslStatus: data.realtime_data.ssl_status,
            securityRating: data.realtime_data.security_rating,
            headersAnalysis: data.realtime_data.headers_analysis,
          },
          premiumLocked: {
            historicalUptimeSla: data.premium_locked_data.historical_uptime_sla,
            loadVarianceGraph: data.premium_locked_data.load_variance_graph,
            instantChannelsAlerting: data.premium_locked_data.instant_channels_alerting,
          },
        });
      } else {
        triggerFallbackError(formattedUrl);
      }
    } catch (error) {
      console.error("Scanner Error:", error);
      triggerFallbackError(formattedUrl);
    } finally {
      setIsScanning(false);
    }
  };

  const triggerFallbackError = (fallbackUrl: string) => {
    setResult({
      realtime: {
        url: fallbackUrl,
        status: "OFFLINE",
        httpCode: 500,
        speed: "0.0s",
        sslStatus: "שגיאה",
        securityRating: "F",
        headersAnalysis: {
          "X-Frame-Options": false,
          "Strict-Transport-Security": false,
          "X-Content-Type-Options": false,
        },
      },
      premiumLocked: {
        historicalUptimeSla: "LOCKED",
        loadVarianceGraph: "LOCKED",
        instantChannelsAlerting: "LOCKED",
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 text-right" dir="rtl">
      <div className="bg-linear-to-b from-blue-50/70 to-white border border-blue-100/80 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* כותרת קומפקטית וממוקדת */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-0.5 rounded-full inline-block mb-2">
            סורק חינמי ללא הרשמה
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
            אבחון זמינות ותשתית בזמן אמת
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium max-w-md mx-auto">
            הזן כתובת אתר לקבלת דוח מיידי על סטטוס השרת, זמני תגובה ואבטחה.
          </p>
        </div>

        {/* טופס קומפקטי ונוח */}
        <form
          onSubmit={handleScan}
          className="flex flex-col sm:flex-row gap-2.5 justify-center items-stretch max-w-xl mx-auto"
        >
          <input
            type="text"
            required
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-left font-mono text-sm transition-all shadow-xs"
            dir="ltr"
          />
          <button
            disabled={isScanning}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm disabled:bg-blue-400 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
          >
            {isScanning ? "מבצע אבחון..." : "הפעל סריקה"}
          </button>
        </form>

        {/* מצב טעינה */}
        {isScanning && (
          <div className="mt-6 flex flex-col items-center gap-2 animate-pulse">
            <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-blue-600 font-medium">
              מבצע בדיקת תגובה, תעודת SSL וכותרות אבטחה...
            </p>
          </div>
        )}

        {/* תוצאות סריקה */}
        {result && !isScanning && (
          <div className="mt-6 space-y-4 animate-fadeIn">
            
            {/* כרטיסיות מדדים מרכזיים */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-xs">
              <div className="text-center p-1.5 border-l border-gray-100 last:border-0 sm:border-l sm:last:border-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  סטטוס שרת
                </div>
                <div
                  className={`font-black text-sm flex items-center justify-center gap-1.5 ${result.realtime.status === "ONLINE" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {result.realtime.status === "ONLINE" && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                  )}
                  {result.realtime.status}
                </div>
              </div>

              <div className="text-center p-1.5 sm:border-l sm:border-gray-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  זמן תגובה
                </div>
                <div className="font-black text-sm text-gray-900 font-mono">
                  {result.realtime.speed}
                </div>
              </div>

              <div className="text-center p-1.5 border-l border-gray-100 last:border-0 sm:border-l sm:last:border-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  תעודת SSL
                </div>
                <div
                  className={`font-extrabold text-xs sm:text-sm ${result.realtime.sslStatus.includes("תקף") ? "text-blue-600" : "text-amber-600"}`}
                >
                  {result.realtime.sslStatus}
                </div>
              </div>

              <div className="text-center p-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                  ציון אבטחה
                </div>
                <div
                  className={`font-black text-sm ${["A", "B"].includes(result.realtime.securityRating) ? "text-purple-600" : "text-red-500"}`}
                >
                  Rating {result.realtime.securityRating}
                </div>
              </div>
            </div>

            {/* פירוט טכנולוגי ופיצ'רים נעולים */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-bold text-xs text-gray-700 flex items-center gap-2">
                <span>🔍</span> ניתוח כותרות הגנה ורשת ביטחון
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {/* X-Frame-Options */}
                <div className="p-3 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">X-Frame-Options (הגנת Clickjacking):</span>
                  <span className="font-bold font-mono">
                    {result.realtime.headersAnalysis["X-Frame-Options"]
                      ? "🟢 קיימת (מאובטח)"
                      : "🔴 חסרה"}
                  </span>
                </div>

                {/* HSTS */}
                <div className="p-3 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Strict-Transport-Security (אכיפת HTTPS):</span>
                  <span className="font-bold font-mono">
                    {result.realtime.headersAnalysis["Strict-Transport-Security"]
                      ? "🟢 פעילה"
                      : "🔴 חסרה"}
                  </span>
                </div>

                {/* נעולים */}
                <div className="p-3 flex justify-between items-center bg-gray-50/50">
                  <span className="text-gray-400 font-medium">יציבות היסטורית (Uptime SLA %):</span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    🔒 נעול - מנויים בלבד
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center bg-gray-50/50">
                  <span className="text-gray-400 font-medium">התראות ל-WhatsApp ו-Telegram:</span>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    🔒 נעול - מנויים בלבד
                  </span>
                </div>
              </div>
            </div>

            {/* הנעה לפעולה */}
            <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl text-center">
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                💡 <strong>טיפ:</strong> בדיקה זו מייצגת צילום מצב בודד. כדי לקבל התראות לנייד בזמן אמת ברגע שהאתר קורס, מומלץ להפעיל ניטור 24/7.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};