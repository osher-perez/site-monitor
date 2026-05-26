"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction, loginUserAction } from "@/app/actions/auth";
export const RegisterForm = () => {

  const router = useRouter();
  // ניהול השלבים: "email" -> "login" או "register"
  const [step, setStep] = useState<"email" | "login" | "register">("email");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", // הוספנו שדה סיסמה
    initialUrl: "",
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);

  // שלב א': בדיקה האם המייל קיים במערכת
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.exists) {
        setStep("login"); // משתמש קיים -> עוברים למסך התחברות
      } else {
        setStep("register"); // משתמש חדש -> עוברים למסך הרשמה מלאה
      }
    } catch (error) {
      alert("שגיאה בחיבור לשרת הבדיקה");
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (step === "register") {
    const result = await registerUserAction(formData);
    
    // אם הרישום הצליח (או החזיר הודעה מהשרת), נעביר את המשתמש לדשבורד
    if (result.success || result.message) {
      router.push("/dashboard"); 
    } else {
      alert("שגיאה בהרשמה: " + result.error);
    }
  } else if (step === "login") {
    // קריאה ל-Action החדש שמבצע בדיקה אמיתית בשרת!
    const result = await loginUserAction(formData);
    
    if (result.success) {
      router.push("/dashboard"); // רק אם הסיסמה נכונה - נכנסים!
    } else {
      alert("שגיאה: " + result.error); // אם שגויה - מציגים שגיאה ונשארים במסך
    }
  }

  setLoading(false);
};

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-right" dir="rtl">
      
      {/* כותרת משתנה לפי המצב */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        {step === "email" && "ברוכים הבאים למוניטור"}
        {step === "login" && "התחברות למערכת"}
        {step === "register" && "יצירת חשבון וניטור ראשוני"}
      </h2>
      
      {/* טופס שלב 1: הזנת מייל בלבד */}
      {step === "email" && (
        <form onSubmit={handleCheckEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">כתובת אימייל</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 text-left"
              dir="ltr"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "בודק במערכת..." : "המשך"}
          </button>
        </form>
      )}

      {/* טופס שלב 2: התחברות או הרשמה (מוצג רק אחרי בדיקת המייל) */}
      {step !== "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* שדות שמוצגים אך ורק בהרשמה */}
          {step === "register" && (
            <>
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

              {/* שדה טלפון נייד */}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">מספר נייד (להתראות SMS)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="050-1234567"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  dir="ltr"
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
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
            </>
          )}

          {/* שדה סיסמה - משותף גם להתחברות וגם להרשמה! */}
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">סיסמה</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 text-left"
              dir="ltr"
            />
          </div>

          {/* צ'קבוקס דיוור - רק להרשמה */}
          {step === "register" && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="marketingConsent" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
                אני מאשר קבלת עדכוני מערכת, התראות ודיוור מדי פעם.
              </label>
            </div>
          )}

          {/* כפתורי פעולה סופיים */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
            >
              {loading ? "מבצע פעולה..." : step === "login" ? "התחברות" : "הרשמה ותחילת ניטור"}
            </button>

            {/* כפתור חזרה קטן למקרה שהמשתמש טעה במייל */}
            <button
              type="button"
              onClick={() => setStep("email")}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition text-center underline"
            >
              שינוי כתובת המייל ({formData.email})
            </button>
          </div>
        </form>
      )}
    </div>
  );
};