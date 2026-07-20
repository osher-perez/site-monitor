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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🛡️ חומת אש מקומית: וידוא הרשאות אדמין קשיחות ברמת ה-Client side
    const loggedInUserId = getCookie("userId");
    const userRole = getCookie("userRole");

    if (userRole !== "admin" && loggedInUserId !== "admin") {
      setTimeout(() => {
        setError("🚫 גישה נדחתה. עמוד זה מיועד למנהלי מערכת בלבד.");
        setLoading(false);
        router.replace("/auth");
      }, 0);
      return;
    }

    async function fetchAdminData() {
      try {
        const response = await fetch("/api/admin/overview");
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
  }, [router]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ניתוב מנוהל וחלק לעמוד הדשבורד עם ה-Query Parameter הייעודי שעיצבנו
  const handleManageCustomer = (userId: string) => {
    router.push(`/dashboard?viewAs=${userId}`);
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
        dir="rtl"
      >
        <p className="text-gray-400 font-mono text-sm animate-pulse">
          טוען נתוני מערכת מנהל...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12" dir="rtl">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-md text-center shadow-sm animate-in fade-in">
          <p className="text-red-600 font-black text-sm mb-1">⚠️ הגנת מערכת</p>
          <p className="text-gray-500 font-mono text-xs leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right max-w-7xl mx-auto" dir="rtl">
      {/* כותרת וסטטיסטיקה עליונה */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight">
            ניהול לקוחות ומערכת
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            מבט על של כל המשתמשים הרשומים, סטטוס הניטור שלהם וכניסה לחשבונות
            לתמיכה טכנית.
          </p>
        </div>

        {/* מונים מהירים מיושרים לעיצוב הבהיר החדש */}
        <div className="bg-gray-50 border border-gray-100 px-5 py-3 rounded-2xl flex items-center gap-6 self-start lg:self-auto shadow-inner">
          <div className="text-center">
            <span className="block text-xl font-black text-gray-950 font-mono">
              {customers.length}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              לקוחות
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <span className="block text-xl font-black text-emerald-600 font-mono">
              {customers.reduce((acc, curr) => acc + curr.upSites, 0)}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              אתרים תקינים
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <span className="block text-xl font-black text-rose-600 font-mono">
              {customers.reduce((acc, curr) => acc + curr.downSites, 0)}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              מושבתים
            </span>
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
          className="w-full sm:max-w-md px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-gray-300 font-medium text-xs transition-all text-right shadow-inner"
        />
      </div>

      {/* טבלת הלקוחות המרכזית */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
          <p className="text-gray-400 text-sm font-medium">
            לא נמצאו לקוחות העונים לנתוני החיפוש.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px]">
                  <th className="p-4 font-black uppercase tracking-wider">
                    לקוח
                  </th>
                  <th className="p-4 font-black uppercase tracking-wider">
                    פרטי קשר
                  </th>
                  <th className="p-4 font-black uppercase tracking-wider text-center">
                    אתרים
                  </th>
                  <th className="p-4 font-black uppercase tracking-wider text-center">
                    סטטוס ניטור
                  </th>
                  <th className="p-4 font-black uppercase tracking-wider text-left">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.userId}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">
                        {customer.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        ID: {customer.userId.slice(0, 8)}... | הצטרף:{" "}
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString(
                              "he-IL",
                            )
                          : "לא ידוע"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-gray-600 font-mono">
                        {customer.email}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {customer.phone}
                      </div>
                    </td>

                    <td className="p-4 text-center font-mono font-bold text-sm text-gray-700">
                      {customer.totalSites}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg text-emerald-700 text-[10px] font-black uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {customer.upSites} תקינים
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
                            customer.downSites > 0
                              ? "bg-rose-50 border border-rose-100 text-rose-700"
                              : "bg-gray-50 border border-gray-100 text-gray-400"
                          }`}
                        >
                          {customer.downSites > 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          )}
                          {customer.downSites} מושבתים
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-left">
                      <button
                        onClick={() => handleManageCustomer(customer.userId)}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        התחזות וכניסה לחשבון ←
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
