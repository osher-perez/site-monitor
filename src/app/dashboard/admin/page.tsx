"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerReport {
  userId: string;
  name: string;
  email: string;
  phone: string;
  totalSites: number;
  upSites: number;
  downSites: number;
  createdAt: string | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const response = await fetch("http://localhost:8000/admin/overview");
        if (!response.ok) {
          throw new Error("נכשל בטעינת נתוני מנהל מהשרת");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("שגיאה בלתי צפויה בתקשורת עם השרת");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // התיקון: ניתוב לעמוד הדשבורד הראשי עם פרמטר לצפייה בלקוח
  const handleManageCustomer = (userId: string) => {
    router.push(`/dashboard?viewAs=${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" dir="rtl">
        <p className="text-gray-500 font-medium text-sm animate-pulse">טוען נתוני מערכת מנהל...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12" dir="rtl">
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl max-w-md text-center">
          <p className="text-red-600 font-bold mb-2">⚠️ שגיאת תקשורת</p>
          <p className="text-gray-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* כותרת וסטטיסטיקה עליונה - עיצוב בהיר ונקי */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">ניהול לקוחות ומערכת</h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            מבט על של כל המשתמשים הרשומים, סטטוס הניטור שלהם וכניסה לחשבונות.
          </p>
        </div>
        
        {/* מונים מהירים */}
        <div className="bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl flex items-center gap-6 self-start lg:self-auto">
          <div className="text-center">
            <span className="block text-lg font-black text-gray-950">{customers.length}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">סה&apos;כ לקוחות</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <span className="block text-lg font-black text-emerald-600">
              {customers.reduce((acc, curr) => acc + curr.upSites, 0)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">אתרים תקינים</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <span className="block text-lg font-black text-rose-600">
              {customers.reduce((acc, curr) => acc + curr.downSites, 0)}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">אתרים מושבתים</span>
          </div>
        </div>
      </div>

      {/* שורת חיפוש */}
      <div className="flex items-center justify-start">
        <input
          type="text"
          placeholder="חפש לקוח לפי שם או כתובת אימייל..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 shadow-sm outline-none focus:border-gray-300 text-sm transition-all text-right"
        />
      </div>

      {/* טבלת הלקוחות המרכזית */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-gray-400 text-sm font-medium">לא נמצאו לקוחות העונים לנתוני החיפוש.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-xs font-bold uppercase text-gray-400 tracking-wider">לקוח</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-400 tracking-wider">פרטי קשר</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-400 tracking-wider text-center">אתרים</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-400 tracking-wider text-center">סטטוס ניטור</th>
                  <th className="p-4 text-xs font-bold uppercase text-gray-400 tracking-wider text-left">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.userId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{customer.name}</div>
                      <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                        הצטרף: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('he-IL') : 'לא ידוע'}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-xs text-gray-600 font-mono">{customer.email}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{customer.phone}</div>
                    </td>

                    <td className="p-4 text-center font-bold text-sm text-gray-700">
                      {customer.totalSites}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-emerald-700 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {customer.upSites} תקינים
                        </span>
                        
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          customer.downSites > 0 
                            ? "bg-rose-50 border border-rose-100 text-rose-700" 
                            : "bg-gray-50 border border-gray-100 text-gray-400"
                        }`}>
                          {customer.downSites > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />}
                          {customer.downSites} מושבתים
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-left">
                      <button
                        onClick={() => handleManageCustomer(customer.userId)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        ניהול אתרים ←
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}