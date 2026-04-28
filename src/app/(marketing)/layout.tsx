import { ReactNode } from 'react';
import { Navbar } from '@/components/marketing/Navbar';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* הנה הנקיון - שורה אחת במקום 40 */}
      <Navbar />
      
      <main className="grow">
        {children}
      </main>

      <footer className="bg-gray-50 border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Site Monitor. כל הזכויות שמורות.
      </footer>
    </div>
  );
}