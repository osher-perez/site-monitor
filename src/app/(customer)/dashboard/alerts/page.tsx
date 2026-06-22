"use client";

import React, { useState } from "react";
import { AlertHistoryLog } from "@/components/dashboard/AlertHistoryLog";

// 📊 נתוני מוק הנדסיים המציגים חלוקה מבוקרת בין הודעות רגילות להתראות דחופות
const initialEvents = [
  {
    id: "evt_101",
    timestamp: "22/06/2026, 11:42:01",
    targetUrl: "my-shop.co.il",
    eventType: "incident_start" as const,
    channels: { email: "sent" as const, telegram: "sent" as const },
  },
  {
    id: "evt_102",
    timestamp: "22/06/2026, 11:45:14",
    targetUrl: "my-shop.co.il",
    eventType: "incident_resolved" as const,
    channels: { email: "sent" as const, telegram: "none" as const },
  },
  {
    id: "evt_103",
    timestamp: "21/06/2026, 09:00:00",
    targetUrl: "portfolio-site.com",
    eventType: "system_report" as const,
    channels: { email: "sent" as const, telegram: "none" as const },
  },
  {
    id: "evt_104",
    timestamp: "20/06/2026, 18:14:22",
    targetUrl: "api.service-core.net",
    eventType: "incident_start" as const,
    channels: { email: "sent" as const, telegram: "failed" as const }, // הדמיית כשל בערוץ הפצה
  },
];

export default function AlertsPage() {
  const [events, setEvents] = useState(initialEvents);

  const handleMarkAllAsRead = () => {
    // לוגיקת עתיד: פנייה ל-API לעדכון סטטוס קריאה במסד הנתונים
    console.log("All events marked as read.");
    // כאן נפעיל בעתיד גם את איפוס המונה ב-Sidebar
  };

  return (
    <div className="space-y-8 p-6 text-right" dir="rtl">
      
      {/* 1. כותרת עמוד ופעולת מערכת מהירה */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-950">יומן אירועים ותקשורת תשתית</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            ריכוז בזמן אמת של חריגות סטטוס, בדיקות תקופתיות וערוצי הפצה
          </p>
        </div>
        
        <button
          onClick={handleMarkAllAsRead}
          className="text-xs text-gray-500 hover:text-gray-800 transition font-bold underline align-middle cursor-pointer"
        >
          סימון כל האירועים כנקראו
        </button>
      </div>

      {/* 2. קוביות מדדים עליונות (Quick Stats) לחוויית בקרה מהירה */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">זמינות כוללת (Uptime)</div>
          <div className="text-lg font-black text-emerald-600 font-mono">99.94%</div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">חריגות ב-24 שעות האחרונות</div>
          <div className="text-lg font-black text-gray-950 font-mono">2</div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ערוצי הפצה מחוברים</div>
          <div className="text-xs font-bold text-blue-600 mt-1 flex gap-2 font-sans">
            <span className="bg-blue-50 px-2 py-0.5 rounded-md">Email Active</span>
            <span className="bg-blue-50 px-2 py-0.5 rounded-md">Telegram Connected</span>
          </div>
        </div>
      </div>

      {/* 3. רינדור קומפוננטת הטבלה שהכנו מראש */}
      <div className="pt-2">
        <AlertHistoryLog events={events} />
      </div>

    </div>
  );
}
