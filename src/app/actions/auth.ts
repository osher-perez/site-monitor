"use server";

function cleanPhoneNumber(phone: string): string {
  // 1. נסיר קודם כל את כל התווים שהם לא מספרים (כולל רווחים ומקפים)
  let digits = phone.replace(/[^0-9]/g, "");
  
  // 2. אם המספר מתחיל ב-972 והוא באורך של מספר ישראלי עם קידומת (למשל 972050...)
  // נוריד את ה-0 המיותר אחרי ה-972
  if (digits.startsWith("9720")) {
    digits = "972" + digits.slice(4);
  }
  
  // 3. אם המספר מתחיל ב-05, נהפוך אותו לפורמט ישראלי תקני (למשל 050644843)
  // (אפשר גם להוסיף לו +972 באופן אוטומטי אם תרצה בעתיד בשביל מערכת ה-SMS)
  
  return digits;
}

export async function registerUserAction(formData: {
  name: string;
  email: string;
  phone: string;
  initialUrl: string;
  marketingConsent: boolean;
}) {
  try {
    // הניקוי האמיתי קורה כאן
    const cleanPhone = cleanPhoneNumber(formData.phone);
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanUrl = formData.initialUrl.trim();

    if (!formData.name || !cleanEmail || !cleanPhone || !cleanUrl) {
      return { success: false, error: "כל השדות הם חובה." };
    }

    console.log("\n=== שרת: נתונים סופיים לאחר ניקוי מלא ===");
    console.log("👤 שם:", formData.name);
    console.log("📧 מייל סופי (קטן):", cleanEmail);
    console.log("📱 טלפון סופי (רק מספרים):", cleanPhone);
    console.log("🌐 URL סופי:", cleanUrl);
    console.log("📢 אישור דיוור:", formData.marketingConsent);
    console.log("=========================================\n");

    return { 
      success: true, 
      message: `הנתונים נקלטו! מייל: ${cleanEmail}, טלפון: ${cleanPhone}` 
    };

  } catch (error) {
    console.error("שגיאה ברישום המשתמש:", error);
    return { success: false, error: "משהו השתבש בתהליך הרישום בשרת." };
  }
}