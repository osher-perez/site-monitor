"use client";

import React from "react";

export interface AlertEvent {
  id: string;
  timestamp: string;
  targetUrl: string;
  eventType: "incident_start" | "incident_resolved" | "system_report";
  channels?: {
    email?: "sent" | "failed" | "none";
    telegram?: "sent" | "failed" | "none";
  };
}

interface AlertHistoryLogProps {
  events?: AlertEvent[];
}

export const AlertHistoryLog = ({ events = [] }: AlertHistoryLogProps) => {
  const getEventBadge = (type: AlertEvent["eventType"]) => {
    switch (type) {
      case "incident_start":
        return (
          <span className="text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md text-[10px] font-black">
            אירוע חריג
          </span>
        );
      case "incident_resolved":
        return (
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-black">
            חזרה לשגרה
          </span>
        );
      case "system_report":
      default:
        return (
          <span className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-black">
            דיווח מערכת
          </span>
        );
    }
  };

  return (
    <div
      className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-right font-sans"
      dir="rtl"
    >
      <div className="mb-6">
        <h2 className="text-base font-black text-gray-950">
          יומן התראות ותקשורת
        </h2>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          תיעוד היסטורי מלא של אירועי מערכת וערוצי הפצה
        </p>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium">
            אין התראות או אירועים מתועדים ביומן כרגע.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-50 text-gray-400 font-bold">
                <th className="pb-3 font-medium">סיווג</th>
                <th className="pb-3 font-medium">נקודת קצה</th>
                <th className="pb-3 font-medium">ערוצי הפצה</th>
                <th className="pb-3 font-medium text-left font-mono">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50">
              {events.map((event) => {
                const emailStatus = event.channels?.email || "none";
                const telegramStatus = event.channels?.telegram || "none";

                return (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-3.5 alignment-baseline">
                      {getEventBadge(event.eventType)}
                    </td>
                    <td className="py-3.5 font-mono text-gray-700 font-medium">
                      {event.targetUrl || "מערכת כללי"}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-3 text-gray-500 font-medium">
                        {emailStatus !== "none" && (
                          <span
                            className={
                              emailStatus === "sent"
                                ? "text-gray-700"
                                : "text-rose-500"
                            }
                          >
                            מייל {emailStatus === "sent" ? "✓" : "✗"}
                          </span>
                        )}
                        {telegramStatus !== "none" && (
                          <span
                            className={
                              telegramStatus === "sent"
                                ? "text-gray-700"
                                : "text-rose-500"
                            }
                          >
                            טלגרם {telegramStatus === "sent" ? "✓" : "✗"}
                          </span>
                        )}
                        {emailStatus === "none" &&
                          telegramStatus === "none" && (
                            <span className="text-gray-300">-</span>
                          )}
                      </div>
                    </td>
                    <td className="py-3.5 text-left font-mono text-gray-400 text-[11px]">
                      {event.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
