import Link from 'next/link';

export const Navbar = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-blue-600">SiteMonitor</div>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition">בית</Link>
          <Link href="/pricing" className="hover:text-blue-600 transition">מחירים</Link>
        </nav>

        <div className="flex gap-4">
          <Link href="/admin-login" className="text-sm font-medium hover:text-blue-600 self-center">
            כניסת מנהל
          </Link>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
            התחל עכשיו
          </button>
        </div>
      </div>
    </header>
  );
};