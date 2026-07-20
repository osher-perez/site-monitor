"use client";

import React from "react";

export interface HistoryLog {
  timestamp?: string;
  createdAt?: string;
  status?: string;
  response_time?: number;
  responseTime?: number;
  isUp?: boolean;
}

interface SiteAnalyticsGraphProps {
  history?: HistoryLog[];
}

export function SiteAnalyticsGraph({ history = [] }: SiteAnalyticsGraphProps) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-right" dir="rtl">
        <h3 className="text-sm font-bold text-gray-900 mb-2">מהירות תגובת שרת בבדיקות האחרונות</h3>
        <p className="text-xs text-gray-400 font-mono">אין עדיין נתוני היסטוריה להצגת גרף אנליטיקה.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-right" dir="rtl">
      <h3 className="text-sm font-bold text-gray-900 mb-6">
        מהירות תגובת שרת בבדיקות האחרונות (במילישניות)
      </h3>

      <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-gray-100 font-mono">
        {history.slice(-12).map((log, index) => {
          const resTime = log.response_time ?? log.responseTime ?? 0;
          const isOnline =
            log.status === "ONLINE" || log.status === "UP" || log.isUp === true;

          const rawTime = log.timestamp || log.createdAt;
          let formattedTime = "--:--";

          if (rawTime) {
            const dateObj = new Date(rawTime);
            if (!isNaN(dateObj.getTime())) {
              formattedTime = dateObj.toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
              });
            }
          }

          const heightPercentage = Math.min((resTime / 2000) * 100, 100);

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group relative h-full justify-end"
            >
              {/* Tooltip בריחוף */}
              <div className="absolute bottom-full mb-2 bg-gray-950 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap border border-gray-800 shadow-md">
                {resTime} ms ({formattedTime})
              </div>

              {/* עמודת הגרף */}
              <div
                style={{ height: `${Math.max(heightPercentage, 6)}%` }}
                className={`w-full rounded-t-md transition-all duration-500 group-hover:opacity-80 ${
                  isOnline ? "bg-indigo-500" : "bg-rose-500"
                }`}
              />

              <span className="text-[9px] text-gray-400 mt-2 block tracking-tighter dir-ltr">
                {formattedTime}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}