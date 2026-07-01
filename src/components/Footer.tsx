import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="mt-auto py-8 border-t border-gray-100 bg-white text-center text-gray-500 text-xs" dir="rtl">
      <div className="flex justify-center gap-6 mb-4">
        <Link href="/" className="hover:text-blue-600 transition-colors">דף הבית</Link>
        <Link href="/legal/terms" className="hover:text-blue-600 transition-colors">תנאי שימוש</Link>
        <Link href="/legal/privacy" className="hover:text-blue-600 transition-colors">מדיניות פרטיות</Link>
        <Link href="/legal/accessibility" className="hover:text-blue-600 transition-colors">הצהרת נגישות</Link>
      </div>
      <p>© {new Date().getFullYear()} SiteMonitor. כל הזכויות שמורות.</p>
    </footer>
  );
};