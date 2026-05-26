"use server";

// פונקציית ניקוי הטלפון שכבר בדקנו והיא עובדת מעולה
function cleanPhoneNumber(phone: string): string {
  let digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("9720")) {
    digits = "972" + digits.slice(4);
  }
  return digits;
}

// 1. פונקציית הרשמה - שולחת את הנתונים לשרת הפייתון שיצפין וישמור
export async function registerUserAction(formData: any) {
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
        password: formData.password, // כאן אנחנו מעבירים את הסיסמה לפייתון שיצפין אותה!
        initialUrl: formData.initialUrl.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.detail || "שגיאה בתהליך ההרשמה מהשרת" };
    }

    return { 
      success: true, 
      message: "החשבון נוצר בהצלחה והאתר הראשון נוסף לניטור!" 
    };

  } catch (error: any) {
    console.error("Registration Action Error:", error);
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח בפייתון" };
  }
}

// 2. פונקציית התחברות - בודקת מול שרת הפייתון שהסיסמה נכונה
export async function loginUserAction(formData: any) {
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
      return { success: false, error: data.detail || "שגיאה בתהליך ההתחברות" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "לא ניתן היה ליצור קשר עם שרת הפיתוח" };
  }
}