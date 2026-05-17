"use client";
import { registerUserAction } from "@/app/actions/auth";
import { useState } from "react";

export const RegisterForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    initialUrl: "",
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  // קריאה לגשר המאובטח בשרת ושליחת הנתונים
  const result = await registerUserAction(formData);

  if (result.success) {
    alert(result.message); // זמני: רק כדי לראות שחזרה תשובת הצלחה מהשרת
    // כאן בעתיד נעביר את המשתמש לדשבורד (router.push('/dashboard'))
  } else {
    alert("שגיאה: " + result.error);
  }

  setLoading(false);
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">יצירת חשבון וניטור ראשוני</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* שדה שם מלא */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">שם מלא</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="ישראל ישראלי"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* שדה אימייל */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">כתובת אימייל (להתחברות)</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* שדה טלפון נייד */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">מספר נייד (להתראות SMS)</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="050-1234567"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* שדה URL ראשון לניטור */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">אתר ראשון לניטור אוטומטי</label>
          <input
            type="url"
            required
            value={formData.initialUrl}
            onChange={(e) => setFormData({ ...formData, initialUrl: e.target.value })}
            placeholder="https://my-site.com"
            className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* צ'קבוקס אישור דיוור (חוק הספאם והעדכונים) */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="marketingConsent"
            checked={formData.marketingConsent}
            onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="marketingConsent" className="text-xs text-slate-500 dark:text-slate-400 selection:bg-transparent cursor-pointer">
            אני מאשר קבלת עדכוני מערכת, התראות ודיוור מדי פעם.
          </label>
        </div>

        {/* כפתור שליחה */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? "מייצר חשבון..." : "הרשמה ותחילת ניטור"}
        </button>
      </form>
    </div>
  );
};