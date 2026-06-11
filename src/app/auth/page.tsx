"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";

function AuthContent() {
  const searchParams = useSearchParams();
  
  // בדיקה בזמן אמת: האם מדובר בכניסה דרך הקישור הסודי של האדמין?
  const isServerAdminMode = searchParams.get("role") === "admin";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-right" dir="rtl">
      <div className="w-full sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* כותרת משתנה דינמית המונעת בלבול וזליגת זהות */}
        <div className="text-center mb-6">
          {isServerAdminMode ? (
            <div className="space-y-1 animate-in fade-in duration-300">
              <span className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide inline-block mb-2">
                🛡️ פנל מבוקר: גישת מנהל מערכת
              </span>
              <h2 className="text-xl font-black text-gray-950 tracking-tight">התחברות למפקדת הניהול</h2>
              <p className="text-xs text-gray-400 font-medium">הזן אישורים מורשים לכניסה לבסיס הנתונים המרכזי</p>
            </div>
          ) : (
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-950 tracking-tight">כניסה למרכז הבקרה</h2>
              <p className="text-xs text-gray-400 font-mono">ניהול וסטטיסטיקות הניטור של האתרים שלך</p>
            </div>
          )}
        </div>

        {/* 🚀 העברת הסטטוס לטופס כדי שידע אם לבצע הרשמה (לקוח) או רק לוגין קשיח (אדמין) */}
        <RegisterForm isAdminMode={isServerAdminMode} />
        
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">מכין סביבת אימות מאובטחת...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}