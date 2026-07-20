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

    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/tools/quick-scan?url=${encodeURIComponent(url)}`,
);
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
            instantChannelsAlerting:
              data.premium_locked_data.instant_channels_alerting,
          },
        });
      } else {
        triggerFallbackError();
      }
    } catch (error) {
      console.error("Scanner Error:", error);
      triggerFallbackError();
    } finally {
      setIsScanning(false);
    }
  };

  const triggerFallbackError = () => {
    setResult({
      realtime: {
        url: url,
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
    <div className="w-full max-w-4xl mx-auto mb-20 px-4 text-right" dir="rtl">
      <div className="bg-linear-to-b from-blue-50/60 to-blue-50/10 border border-blue-100 rounded-3xl p-8 md:p-10 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
            אבחון זמינות ותשתית בזמן אמת
          </h2>
          <p className="text-sm text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
            הזן כתובת אתר (URL) לקבלת דוח מיידי על סטטוס השרת, זמני תגובה, אבטחת
            Headers ותקינות פרוטוקול ה-SSL.
          </p>
        </div>

        <form
          onSubmit={handleScan}
          className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto"
        >
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
            {isScanning ? "מבצע אבחון..." : "הפעל סריקת אבחון"}
          </button>
        </form>

        {isScanning && (
          <div className="mt-8 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-blue-600 font-bold tracking-wide">
              יוצר קשר עם שרת היעד, מנתח תגובת DNS ומודד זמני תגובה בזמן אמת...
            </p>
          </div>
        )}

        {result && !isScanning && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            {/* כרטיסיות סיכום מהיר */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  סטטוס שרת
                </div>
                <div
                  className={`font-extrabold text-sm flex items-center justify-center gap-1.5 ${result.realtime.status === "ONLINE" ? "text-emerald-600" : "text-red-600"}`}
                >
                  {result.realtime.status === "ONLINE" && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                  )}
                  {result.realtime.status}
                </div>
              </div>

              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  זמן תגובה כולל
                </div>
                <div className="font-extrabold text-sm text-gray-900 font-mono">
                  {result.realtime.speed}
                </div>
              </div>

              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  תעודת SSL
                </div>
                <div
                  className={`font-extrabold text-sm ${result.realtime.sslStatus.includes("תקף") ? "text-blue-600" : "text-amber-600"}`}
                >
                  {result.realtime.sslStatus}
                </div>
              </div>

              <div className="text-center p-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  ציון אבטחת שרת
                </div>
                <div
                  className={`font-extrabold text-sm ${["A", "B"].includes(result.realtime.securityRating) ? "text-purple-600" : "text-red-500"}`}
                >
                  Rating {result.realtime.securityRating}
                </div>
              </div>
            </div>

            {/* טבלה מורחבת: השוואת נתונים ואפקט שיווקי למפתחים */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-700">
                🔍 ניתוח הנדסי מורחב ורשת ביטחון
              </div>

              <div className="divide-y divide-gray-100">
                {/* בדיקת X-Frame-Options */}
                <div className="p-4 flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    כותרת הגנה X-Frame-Options (מניעת הזרקות קוד):
                  </span>
                  <span className="font-bold font-mono">
                    {result.realtime.headersAnalysis["X-Frame-Options"]
                      ? "🟢 קיימת (מאובטח)"
                      : "🔴 חסרה (סיכון קליקג'קינג)"}
                  </span>
                </div>

                {/* בדיקת HSTS */}
                <div className="p-4 flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    כותרת Strict-Transport-Security (אכיפת HTTPS):
                  </span>
                  <span className="font-bold font-mono">
                    {result.realtime.headersAnalysis[
                      "Strict-Transport-Security"
                    ]
                      ? "🟢 פעילה"
                      : "🔴 חסרה"}
                  </span>
                </div>

                {/* שורה חסומה 1 - SLA */}
                <div className="p-4 flex justify-between items-center text-sm bg-striped bg-slate-50/50">
                  <span className="text-gray-400 font-medium">
                    מדד יציבות היסטורי חודשי (Uptime SLA %):
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-wide">
                    🔒 נעול - דורש ניטור רציף 24/7
                  </span>
                </div>

                {/* שורה חסומה 2 - תנודתיות עומסים */}
                <div className="p-4 flex justify-between items-center text-sm bg-striped bg-slate-50/50">
                  <span className="text-gray-400 font-medium">
                    גרף תנודתיות זמני תגובה בשעות שיא:
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-wide">
                    🔒 נעול - מוגבל לחברי Premium
                  </span>
                </div>

                {/* שורה חסומה 3 - ערוצי התראה */}
                <div className="p-4 flex justify-between items-center text-sm bg-striped bg-slate-50/50">
                  <span className="text-gray-400 font-medium">
                    ניתוב התראות מיידי (WhatsApp, SMS, Telegram):
                  </span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md tracking-wide">
                    🔒 נעול - פעיל רק בחשבון מנוטר
                  </span>
                </div>
              </div>
            </div>

            {/* פסקת הנעה לפעולה חכמה מתחת לתוצאות */}
            <div className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl text-center">
              <p className="text-xs text-amber-800 leading-relaxed font-medium max-w-2xl mx-auto">
                💡 <strong>שים לב:</strong> בדיקה זו מייצגת צילום מצב (Snapshot)
                של השנייה הנוכחית בלבד. קוד משתנה, שרתים חווים עומסי פתע ותעודות
                SSL פוקעות בלילה. כדי להבטיח שאתה יודע על תקלות לפני הלקוחות
                שלך, מומלץ להפעיל ניטור רציף.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
