"use server";

import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

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
// 1. בדיקה דינמית אם המייל קיים במערכת
// ========================================================
export async function checkEmailAction(email: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const client = await clientPromise;
    const db = client.db("site_monitor");

    const existingUser = await db.collection("users").findOne({ email: cleanEmail });

    return { success: true, exists: !!existingUser };
  } catch (error) {
    console.error("Check Email Action Error:", error);
    return { success: false, error: "שגיאה בחיבור לסיסמת הנתונים" };
  }
}

// ========================================================
// 2. פונקציית הרשמה
// ========================================================
export async function registerUserAction(formData: RegisterFormData) {
  try {
    const cleanPhone = cleanPhoneNumber(formData.phone);
    const cleanEmail = formData.email.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db("site_monitor");
    const usersCollection = db.collection("users");

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await usersCollection.findOne({ email: cleanEmail });
    if (existingUser) {
      return { success: false, error: "כתובת האימייל כבר רשומה במערכת" };
    }

    const newUser = {
      name: formData.name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: formData.password,
      role: "customer",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const userIdStr = result.insertedId.toString();

    // אם הזינו אתר ראשוני בסריקה, נוסיף אותו לאוסף האתרים
    if (formData.initialUrl && formData.initialUrl.trim()) {
      await db.collection("sites").insertOne({
        userId: userIdStr,
        url: formData.initialUrl.trim(),
        createdAt: new Date(),
      });
    }

    const cookieStore = await cookies();
    const assignedRole = "customer";
    const finalName = formData.name.trim();

    cookieStore.set("userId", userIdStr, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userRole", assignedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userName", finalName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      userRole: assignedRole,
      message: "החשבון נוצר בהצלחה!",
    };
  } catch (error) {
    console.error("Registration Action Error:", error);
    return {
      success: false,
      error: "שגיאה ביצירת החשבון במסד הנתונים",
    };
  }
}

// ========================================================
// 3. פונקציית התחברות
// ========================================================
export async function loginUserAction(formData: LoginFormData) {
  try {
    const cleanEmail = formData.email.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db("site_monitor");
    const user = await db.collection("users").findOne({ email: cleanEmail });

    if (!user || user.password !== formData.password) {
      return { success: false, error: "אימייל או סיסמה שגויים" };
    }

    const userIdStr = user._id.toString();
    const assignedRole = user.role || "customer";
    const finalName = user.name || cleanEmail.split("@")[0] || "מנטר מערכת";

    const cookieStore = await cookies();

    cookieStore.set("userId", userIdStr, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userRole", assignedRole, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("userName", finalName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return {
      success: true,
      userRole: assignedRole,
      message: "התחברת בהצלחה!",
    };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: "שגיאה בתהליך ההתחברות" };
  }
}