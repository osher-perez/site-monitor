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

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  initialUrl: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

// ========================================================
// בדיקה דינמית אם המייל קיים במערכת (בזמן אמת)
// ========================================================
export async function checkEmailAction(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    const response = await fetch(`http://localhost:8000/auth/check-email?email=${encodeURIComponent(cleanEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "שגיאה בבדיקת כתובת האימייל" };
    }

    return { success: true, exists: data.exists };
  } catch (error) {
    console.error("Check Email Action Error:", error);
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח" };
  }
}

// ========================================================
// 1. פונקציית הרשמה - סנכרון קוקיז מלא מול ה-Middleware
// ========================================================
export async function registerUserAction(formData: RegisterFormData) {
  try {
    const cleanPhone = cleanPhoneNumber(formData.phone);
    const cleanEmail = formData.email.trim().toLowerCase();

    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password: formData.password,
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
    const isUserAdmin = data.isAdmin || data.role === "admin" || false;
    const assignedRole = isUserAdmin ? "admin" : "customer";
    
    // שמירת מזהה המשתמש לעבודה ב-Client Side
    cookieStore.set("userId", data.userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // שבוע אחד
      path: "/",
    });

    // ✅ תיקון קריטי: החלפת isAdmin ב-userRole עבור תאימות מלאה ל-Middleware
    cookieStore.set("userRole", assignedRole, {
      httpOnly: false, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      userRole: assignedRole,
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

// ========================================================
// 2. פונקציית התחברות - יישור קו הרמטי
// ========================================================
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
    const isUserAdmin = data.isAdmin || data.role === "admin" || false;
    const assignedRole = isUserAdmin ? "admin" : "customer";
    
    // שמירת ה-userId בקוקיז
    cookieStore.set("userId", data.userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // ✅ תיקון קריטי: שמירת הסטטוס כ-userRole למניעת נעילת האדמין מחוץ לפנל
    cookieStore.set("userRole", assignedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { 
      success: true, 
      userRole: assignedRole, 
      message: data.message 
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח" };
  }
}