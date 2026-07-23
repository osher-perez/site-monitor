import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-gray-200/60 bg-gray-50/30 text-center" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* אזור הקישורים */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            דף הבית
          </Link>
          <Link href="/legal/terms" className="hover:text-blue-600 transition-colors">
            תנאי שימוש
          </Link>
          <Link href="/legal/privacy" className="hover:text-blue-600 transition-colors">
            מדיניות פרטיות
          </Link>
          <Link href="/legal/accessibility" className="hover:text-blue-600 transition-colors">
            הצהרת נגישות
          </Link>
        </div>

        {/* שורת זכויות יוצרים */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} SiteMonitor. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
};