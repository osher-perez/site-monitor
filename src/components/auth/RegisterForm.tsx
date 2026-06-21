"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction, loginUserAction, checkEmailAction } from "@/app/actions/auth";

interface RegisterFormProps {
  isAdminMode?: boolean;
}

export const RegisterForm = ({ isAdminMode = false }: RegisterFormProps) => {
  const router = useRouter();
  
  const [step, setStep] = useState<"email" | "login" | "register">("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    initialUrl: "",
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // שלב א': בדיקה מאובטחת בזמן אמת האם המייל קיים במערכת
  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanedEmail = formData.email.trim().toLowerCase();
    
    try {
      const result = await checkEmailAction(cleanedEmail);

      if (!result.success) {
        setErrorMessage(result.error || "שגיאה בבדיקת כתובת האימייל");
        return;
      }

      setFormData(prev => ({ ...prev, email: cleanedEmail }));

      if (result.exists) {
        setStep("login");
      } else {
        if (isAdminMode) {
          setErrorMessage("🚫 שגיאה: משתמש זה אינו רשום כמנהל מערכת.");
          return;
        }
        setStep("register");
      }
    } catch (error) {
      setErrorMessage("לא ניתן להתחבר לשרת לצורך בדיקת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  // שלב ב': הגשת הטופס הסופי וניתוב דינמי מבוסס תפקיד (userRole)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (step === "register") {
      const result = await registerUserAction(formData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error || "שגיאה בתהליך ההרשמה");
      }
    } else if (step === "login") {
      const result = await loginUserAction(formData);
      if (result.success) {
        if (result.userRole === "admin" || isAdminMode) {
          router.push("/admin-panel");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(result.error || "הסיסמה שהוזנה אינה נכונה");
      }
    }

    setLoading(false);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setErrorMessage(null);
    setFormData(prev => ({
      ...prev,
      name: "",
      phone: "",
      password: "",
      initialUrl: "",
      marketingConsent: false
    }));
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white border border-gray-100 rounded-3xl shadow-xl text-right" dir="rtl">
      
      {/* כותרת ותת-כותרת משתנות בהתאם לשלב ולתפקיד */}
      <div className="mb-6">
        <h2 className="text-xl font-black tracking-tight text-gray-950 mb-1">
          {step === "email" && (isAdminMode ? "אימות מנהל מערכת" : "כניסת משתמש / הרשמה")}
          {step === "login" && "התחברות לחשבון"}
          {step === "register" && "יצירת חשבון מנטר"}
        </h2>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          {step === "email" && (isAdminMode ? "הזן את כתובת המייל הייעודית של צוות הניהול." : "Sign up / In")}
          {step === "login" && `ברוך השב! אנא הזן סיסמה להמשך עבור ${formData.email}`}
          {step === "register" && "נראה שאתה פה בפעם הראשונה! השלם את פרטי הרישום."}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100 text-center font-sans">
          {errorMessage}
        </div>
      )}
      
      {/* ----------------- שלב 1: הזנת מייל בלבד ----------------- */}
      {step === "email" && (
        <form onSubmit={handleCheckEmail} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">כתובת אימייל</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-blue-500 focus:bg-white text-left font-sans text-sm transition-all"
              dir="ltr"
            />
          </div>

          {!isAdminMode && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2.5">
              <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
              <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
                <strong>שים לב:</strong> אנא ודא שכתובת המייל מדויקת לחלוטין. במידה ותקליד מייל שגוי, המערכת תתייחס אלייך כאל משתמש חדש ותוביל אותך בטעות להרשמה מחדש.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gray-950 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "בודק נתונים..." : "המשך למערכת"}
          </button>
        </form>
      )}

      {/* ----------------- שלב 2: הזנת סיסמה / הרשמה מלאה ----------------- */}
      {step !== "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {step === "register" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">שם מלא</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ישראל ישראלי"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-blue-500 focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">מספר נייד (להתראות SMS)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="050-1234567"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-blue-500 focus:bg-white text-left font-sans text-sm transition-all"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">אתר ראשון לניטור אוטומטי</label>
                <input
                  type="url"
                  required
                  value={formData.initialUrl}
                  onChange={(e) => setFormData({ ...formData, initialUrl: e.target.value })}
                  placeholder="https://my-site.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-blue-500 focus:bg-white text-left font-sans text-sm transition-all"
                  dir="ltr"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              {step === "login" ? "הזן את סיסמה שלך" : "קבע סיסמה לחשבון החדש"}
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:border-blue-500 focus:bg-white text-left font-sans text-sm transition-all"
              dir="ltr"
            />
          </div>

          {step === "register" && (
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="marketingConsent"
                checked={formData.marketingConsent}
                onChange={(e) => setFormData({ ...formData, marketingConsent: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
              />
              <label htmlFor="marketingConsent" className="text-[11px] leading-normal text-gray-400 cursor-pointer select-none">
                I agree to receive system updates, rapid speed checks, monthly uptime statistics and critical server alerts for my monitored URLs.
              </label>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-950 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "מבצע פעולה..." : step === "login" ? "התחבר כעת" : "צור חשבון והפעל ניטור"}
            </button>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="text-xs text-gray-400 hover:text-gray-600 transition text-center underline pt-1"
            >
              שינוי כתובת המייל או חזרה אחורה
            </button>
          </div>
        </form>
      )}
    </div>
  );
};