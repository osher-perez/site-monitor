"use client";

import React from "react";

export interface SystemMessage {
  id: string;
  type: "info" | "warning" | "success";
  text: string;
}

interface NotificationFeedProps {
  messages: SystemMessage[];
}

export const NotificationFeed = ({ messages }: NotificationFeedProps) => {
  if (messages.length === 0) return null;

  // פונקציית עזר לחילוץ קלאסים עיצוביים בצורה נקייה על פי סוג האירוע
  const getFeedStyles = (type: "info" | "warning" | "success") => {
    switch (type) {
      case "success":
        return "bg-emerald-50/60 border-emerald-100 text-emerald-800";
      case "warning":
        return "bg-amber-50/70 border-amber-200 text-amber-800"; // חציצה מדויקת לאירועי אזהרה
      case "info":
      default:
        return "bg-blue-50/60 border-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-2 text-right" dir="rtl">
      {/* כותרת קורקטית, סמכותית וממוקדת דשבורד */}
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider px-1">
        יומן אירועי מערכת
      </h3>
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed shadow-2xs transition-all ${getFeedStyles(msg.type)}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};