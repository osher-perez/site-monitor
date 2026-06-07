"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUserAction, loginUserAction, checkEmailAction } from "@/app/actions/auth";

export const RegisterForm = () => {
  const router = useRouter();
  
  // ניהול השלבים הדינמיים: "email" -> "login" או "register"
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

    // ניקוי מוקדם של המייל מרווחים מיותרים והמרה לאותיות קטנות למניעת באגים
    const cleanedEmail = formData.email.trim().toLowerCase();
    
    try {
      // שימוש ב-Server Action המאובטח שבנינו במקום fetch ישיר מהדפדפן
      const result = await checkEmailAction(cleanedEmail);

      if (!result.success) {
        setErrorMessage(result.error || "שגיאה בבדיקת כתובת האימייל");
        return;
      }

      // נעדכן את המייל הנקי בתוך ה-formData
      setFormData(prev => ({ ...prev, email: cleanedEmail }));

      if (result.exists) {
        setStep("login"); // המשתמש קיים -> עוברים בצורה חלקה למסך סיסמה (התחברות)
      } else {
        setStep("register"); // משתמש חדש -> פותחים טופס הרשמה מלא
      }
    } catch (error) {
      setErrorMessage("לא ניתן להתחבר לשרת לצורך בדיקת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  // שלב ב': הגשת הטופס הסופי (התחברות או הרשמה)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (step === "register") {
      const result = await registerUserAction(formData);
      if (result.success) {
        // ניתוב חכם על בסיס הרשאות אדמין / לקוח
        if (result.isAdmin) {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(result.error || "שגיאה בתהליך ההרשמה");
      }
    } else if (step === "login") {
      const result = await loginUserAction(formData);
      if (result.success) {
        // ניתוב חכם על בסיס הרשאות אדמין / לקוח
        if (result.isAdmin) {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(result.error || "הסיסמה שהוזנה אינה נכונה");
      }
    }

    setLoading(false);
  };

  // פונקציית חזרה חכמה - מאפסת את השדות הרגישים כדי למנוע זליגת נתונים בטעות
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
      
      {/* כותרת ותת-כותרת משתנות בהתאם לשלב */}
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 mb-1">
          {step === "email" && "ברוכים הבאים ל-SiteMonitor"}
          {step === "login" && "התחברות לחשבון"}
          {step === "register" && "יצירת חשבון מנטר"}
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          {step === "email" && "הזן אימייל ונזהה אוטומטית אם יש לך חשבון או שאתה משתמש חדש."}
          {step === "login" && `ברוך השב! אנא הקלד את הסיסמה עבור ${formData.email}`}
          {step === "register" && "נראה שאתה פה בפעם הראשונה! נשמח להכיר אותך."}
        </p>
      </div>

      {/* הודעת שגיאה כללית במידה ויש */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100 font-sans text-center">
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

          {/* שכבת ההגנה: תיבת אזהרה חכמה למניעת טעויות הקלדה של משתמשים רשומים */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2.5">
            <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
            <p className="text-[11px] leading-relaxed text-amber-700 font-medium">
              <strong>שים לב:</strong> אנא ודא שכתובת המייל מדויקת לחלוטין. במידה ותקליד מייל שגוי, המערכת תתייחס אלייך כאל משתמש חדש ותוביל אותך בטעות להרשמה מחדש.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? "בודק נתונים..." : formData.email.includes("@") ? `המשך עם ${formData.email.trim().toLowerCase()}` : "המשך למערכת"}
          </button>
        </form>
      )}

      {/* ----------------- שלב 2: הזנת סיסמה / הרשמה מלאה ----------------- */}
      {step !== "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* שדות שמוצגים אך ורק למשתמשים חדשים בתהליך הרשמה */}
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

          {/* שדה סיסמה - משותף לשני המצבים לאחר אישור המייל */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              {step === "login" ? "הזן את הסיסמה שלך" : "קבע סיסמה לחשבון החדש"}
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

          {/* צ'קבוקס דיוור ואישור - מוצג רק בהרשמה */}
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

          {/* כפתורי שליחה ופעולה סופיים */}
          <div className="flex flex-col gap-2 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "מבצע פעולה..." : step === "login" ? "התחבר כעת" : "צור חשבון והפעל ניטור"}
            </button>

            {/* שימוש בפונקציית החזרה החכמה והמאפסת */}
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