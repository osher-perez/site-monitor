import { ReactNode } from 'react';

// כאן אנחנו מיישמים את סעיף ה-SEO מחוקת הפרויקט
export const metadata = {
  title: {
    default: 'Site Monitor | ניטור אתרים מקצועי',
    template: '%s | Site Monitor'
  },
  description: 'פתרון ניטור אתרים חכם לעסקים. קבל התראות בזמן אמת על נפילות אתרים, בדיקות מהירות ודוחות ביצועים.',
};

interface MarketingLayoutProps {
  children: ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* תפריט עליון (Header) - משותף לכל דפי השיווק */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">SiteMonitor</div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="/" className="hover:text-blue-600 transition">בית</a>
            <a href="/pricing" className="hover:text-blue-600 transition">מחירים</a>
            <a href="/about" className="hover:text-blue-600 transition">אודות</a>
          </nav>
          <div className="flex gap-4">
            <button className="text-sm font-medium hover:text-blue-600">התחבר</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
              התחל עכשיו
            </button>
          </div>
        </div>
      </header>

      {/* התוכן של הדף (page.tsx) יוזרק כאן */}
      <main className="flex-grow">
        {children}
      </main>

      {/* פוטר (Footer) - קריטי לאמינות ו-SEO */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Site Monitor. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}