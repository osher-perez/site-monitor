export const HeroSection = () => {
  return (
    <div className="text-center max-w-3xl mx-auto" dir="rtl">
      {/* Badge עליון */}
      <span className="inline-block px-3.5 py-1 mb-3 text-[11px] font-bold tracking-wider text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
        ניטור זמינות ותשתית בזמן אמת
      </span>

      {/* כותרת ראשית */}
      <h1 className="text-4xl md:text-5xl font-black text-gray-950 mb-3 leading-tight tracking-tight">
        רציפות דיגיטלית קריטית. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          תמיד בבקרה מלאה.
        </span>
      </h1>

      {/* תת-כותרת */}
      <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto leading-relaxed font-normal">
        פלטפורמת ניטור מבוזרת המבצעת אימות זמינות רציף ומספקת התראות מיידיות. הגנה היקפית על הנכסים הדיגיטליים של העסק שלך, 24/7.
      </p>
    </div>
  );
};