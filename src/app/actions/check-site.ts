"use server"; // זה אומר שהקוד ירוץ רק בשרת

export async function checkSiteAction(url: string) {
  // 1. נמדוד זמן התחלה
  const startTime = Date.now();

  try {
    // 2. ננסה "לגשת" לאתר
    const response = await fetch(url, { 
      cache: 'no-store', // אל תשמור תוצאות קודמות
      method: 'GET' 
    });

    // 3. נמדוד זמן סיום
    const endTime = Date.now();
    const duration = endTime - startTime;

    return {
      success: true,
      status: response.status,
      responseTime: duration,
      isHttps: url.startsWith('https')
    };

  } catch (error) {
    // אם האתר לא קיים או השרת נפל
    return {
      success: false,
      error: "לא הצלחנו לגשת לאתר. וודא שהכתובת נכונה."
    };
  }
}