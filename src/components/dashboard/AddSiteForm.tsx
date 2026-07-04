"use client";

import Link from "next/link";

interface AddSiteFormProps {
  url: string;
  setUrl: (url: string) => void;
  message: string;
  isLoading: boolean;
  isMaxedOut: boolean;
  isAdminAction: boolean;
  backLink: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export function AddSiteForm({
  url,
  setUrl,
  message,
  isLoading,
  isMaxedOut,
  isAdminAction,
  backLink,
  handleSubmit,
}: AddSiteFormProps) {
  return (
    <div className="max-w-xl mx-auto text-gray-950" dir="rtl">
      {/* כפתור חזרה חכם */}
      <Link href={backLink} className="text-gray-400 hover:text-gray-950 mb-6 inline-block text-sm transition-all hover:translate-x-1">
        ← חזרה ל-Dashboard
      </Link>

      {/* כרטיס הטופס */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in-50 duration-200">
        <div className="text-center mb-8">
          {isAdminAction && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wide inline-block mb-3">
              🛡️ פעולת מנהל: הוספה עבור לקוח
            </span>
          )}
          <h2 className="text-2xl font-black tracking-tight text-gray-950 mb-1">
            הוספת אתר לניטור
          </h2>
          <p className="text-xs text-gray-400 font-mono">הזן כתובת אתר לבדיקה וניטור אוטומטי</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2 text-sm font-medium">
              כתובת ה-URL של האתר:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono text-sm placeholder-gray-400 focus:border-indigo-300 focus:bg-white focus:outline-none transition-all text-left"
              placeholder="https://example.com"
              required
              disabled={isLoading || isMaxedOut}
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isMaxedOut}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-sm transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none text-sm"
          >
            {isLoading ? "מעבד נתונים..." : "בדוק והוסף למערכת"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 text-center text-xs py-3 rounded-xl font-mono border ${
            isMaxedOut ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-gray-50 border-gray-100 text-gray-600'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
