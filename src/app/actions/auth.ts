"use server";

import clientPromise from "@/lib/mongodb";

// פונקציית ניקוי הטלפון שכבר בדקנו והיא עובדת מעולה
function cleanPhoneNumber(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("9720")) {
    digits = "972" + digits.slice(4);
  }
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
    // 1. ניקוי הנתונים (ה"מכונת כביסה" שלנו)
    const cleanPhone = cleanPhoneNumber(formData.phone);
    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanUrl = formData.initialUrl.trim();

    // בדיקת תקינות בסיסית
    if (!formData.name || !cleanEmail || !cleanPhone || !cleanUrl) {
      return { success: false, error: "כל השדות הם חובה." };
    }

    // 2. חיבור פיזי ל-MongoDB Atlas
    const client = await clientPromise;
    // כאן אנחנו בוחרים את שם בסיס הנתונים (מומלץ לוודא שזה אותו שם כמו בפייתון)
    const db = client.db("site_monitor"); 

    // 3. בדיקה: האם המשתמש כבר קיים במערכת?
    const existingUser = await db.collection("users").findOne({ email: cleanEmail });
    
    if (existingUser) {
      return { success: false, error: "כתובת האימייל הזו כבר רשומה במערכת." };
    }

    // 4. יצירת המשתמש החדש באוסף 'users'
    const userResult = await db.collection("users").insertOne({
      name: formData.name,
      email: cleanEmail,
      phone: cleanPhone,
      marketingConsent: formData.marketingConsent,
      role: "user", // הגדרה אוטומטית כמשתמש רגיל (ולא אדמין)
      createdAt: new Date(),
    });

    // 5. אוטומציה: יצירת האתר הראשון באוסף 'sites' וקישורו ל-ID של המשתמש
    await db.collection("sites").insertOne({
      url: cleanUrl,
      userId: userResult.insertedId, // המפתח הסודי שמקשר את האתר למשתמש הספציפי הזה!
      status: "pending", // סטטוס ראשוני שהפייתון יוכל לקרוא ולהתחיל לבדוק
      createdAt: new Date(),
    });

    console.log(`\n🎉 הצלחה! משתמש חדש ואתר נוצרו ב-MongoDB עבור: ${cleanEmail}\n`);

    return { 
      success: true, 
      message: "החשבון נוצר בהצלחה והאתר שלך התווסף לניטור!" 
    };

  } catch (error) {
    console.error("שגיאה קריטית בתהליך הרישום בשרת:", error);
    return { success: false, error: "משהו השתבש במהלך השמירה בבסיס הנתונים." };
  }
}