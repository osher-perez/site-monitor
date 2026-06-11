"use client";

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

  return (
    <div className="space-y-2 text-right" dir="rtl">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider px-1">הודעות ועדכונים</h3>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-3.5 rounded-xl border text-xs font-medium leading-relaxed shadow-2xs ${
              msg.type === "success" 
                ? "bg-emerald-50/60 border-emerald-100 text-emerald-800" 
                : "bg-blue-50/60 border-blue-100 text-blue-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};