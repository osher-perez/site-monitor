"use server";

import { cookies } from "next/headers";

// פונקציית ניקוי הטלפון
function cleanPhoneNumber(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("9720")) {
    digits = "972" + digits.slice(4);
  }
  return digits;
}

// הגדרת המבנה של נתוני טופס ההרשמה עבור TypeScript
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  initialUrl: string;
}

// הגדרת המבנה של נתוני טופס ההתחברות עבור TypeScript
interface LoginFormData {
  email: string;
  password: string;
}

// ========================================================
// צינור חדש: בדיקה דינמית אם המייל קיים במערכת (בזמן אמת)
// ========================================================
export async function checkEmailAction(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    // קריאה לפייתון לבדיקת קיום המשתמש
    const response = await fetch(`http://localhost:8000/auth/check-email?email=${encodeURIComponent(cleanEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "שגיאה בבדיקת כתובת האימייל" };
    }

    // השרת בפייתון יחזיר למשל: { exists: true/false }
    return { success: true, exists: data.exists };
  } catch (error) {
    console.error("Check Email Action Error:", error);
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח" };
  }
}

// 1. פונקציית הרשמה - שולחת את הנתונים לשרת הפייתון שיצפין וישמור
export async function registerUserAction(formData: RegisterFormData) {
  try {
    // ניקוי הנתונים לפני השליחה
    const cleanPhone = cleanPhoneNumber(formData.phone);
    const cleanEmail = formData.email.trim().toLowerCase();

    // קריאה לגשר המאובטח בשרת הפייתון
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: formData.password, // מועבר מוצפן בפייתון
        initialUrl: formData.initialUrl.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "שגיאה בתהליך ההרשמה מהשרת",
      };
    }

    const cookieStore = await cookies();
    
    // שומרים את ה-userId בקוקיז מיד עם ההרשמה
    cookieStore.set("userId", data.userId, {
      httpOnly: false, // מאפשר לקומפוננטות לקוח לקרוא את ה-ID בדשבורד
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // תקף לשבוע
      path: "/",
    });

    // שומרים את סטטוס האדמין בעוגייה כדי שהמערכת תדע לאבטח את המעברים בין הדפים
    cookieStore.set("isAdmin", String(data.isAdmin || false), {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      isAdmin: data.isAdmin || false,
      message: "החשבון נוצר בהצלחה והאתר הראשון נוסף לניטור!",
    };
  } catch (error) {
    console.error("Registration Action Error:", error);
    return {
      success: false,
      error: "לא ניתן היה ליצור קשר עם שרת הפיתוח בפייתון",
    };
  }
}

// 2. פונקציית התחברות - בודקת מול שרת הפייתון שהסיסמה נכונה
export async function loginUserAction(formData: LoginFormData) {
  try {
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "אימייל או סיסמה שגויים" };
    }

    const cookieStore = await cookies();
    
    // שמירת ה-userId בקוקיז
    cookieStore.set("userId", data.userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // שמירת ה-isAdmin בקוקיז
    cookieStore.set("isAdmin", String(data.isAdmin || false), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { 
      success: true, 
      isAdmin: data.isAdmin || false, 
      message: data.message 
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח" };
  }
}