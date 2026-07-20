"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ייבוא הקומפוננטות המבודדות
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import {
  NotificationFeed,
  SystemMessage,
} from "@/components/dashboard/NotificationFeed";
import { QuickActionGate } from "@/components/dashboard/QuickActionGate";
import { MonitoredSitesGrid, Site } from "@/components/dashboard/MonitoredSitesGrid";

interface UserProfile {
  name: string;
  plan: string;
  email?: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const viewAsId = searchParams.get("viewAs");

  const MAX_SITES_LIMIT = 3;

  const loggedInUserId = getCookie("userId");
  const userRole = getCookie("userRole");
  const cookieUserName = getCookie("userName");

  const isAdminAction = !!(
    viewAsId &&
    (userRole === "admin" || loggedInUserId === "admin")
  );
  const targetUserId = isAdminAction ? viewAsId : loggedInUserId;

  const [profile] = useState<UserProfile | null>(() => {
    if (!targetUserId) return null;
    if (isAdminAction) {
      return { name: "לקוח מנוהל", plan: "בסיסי (חינם)" };
    }
    return {
      name: cookieUserName || "מנטר מערכת",
      plan: userRole === "admin" ? "מנהל מערכת (Admin)" : "בסיסי (חינם)",
    };
  });

  const [errorMsg] = useState<string | null>(() => {
    if (!targetUserId) return "מזהה משתמש לא נמצא. נא להתחבר מחדש.";
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState<Site[]>([]);
  const [messages, setMessages] = useState<SystemMessage[]>([]);

  useEffect(() => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetch(`/api/list-sites?user_id=${targetUserId}`)
      .then((res) => {
        if (!res.ok) throw new Error("נכשל בטעינת רשימת האתרים");
        return res.json();
      })
      .then((data: unknown) => {
        if (!isMounted) return;

        if (Array.isArray(data)) {
          const formatted: Site[] = data.map((item: Record<string, unknown>, index: number) => {
            const rawId = item._id || item.id;
            const siteId = typeof rawId === "string" ? rawId : `site-${index}`;
            const url = typeof item.url === "string" ? item.url : "";
            const status = typeof item.status === "string" ? item.status : "ONLINE";
            const lastChecked =
              (typeof item.last_checked === "string" && item.last_checked) ||
              (typeof item.lastChecked === "string" && item.lastChecked) ||
              new Date().toISOString();
            const isUp =
              typeof item.isUp === "boolean"
                ? item.isUp
                : status === "ONLINE";

            return {
              _id: siteId,
              id: siteId,
              url,
              status,
              isUp,
              last_checked: lastChecked,
              lastChecked,
            } as Site;
          });

          setSites(formatted);
        } else {
          setSites([]);
        }
      })
      .catch((err: unknown) => {
        console.error("Dashboard fetch error:", err);
        if (isMounted) setSites([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    setMessages([
      {
        id: "1",
        type: "success",
        text: "🔒 מערכת הניטור פועלת בצורה מאובטחת וחסינה.",
      },
      {
        id: "2",
        type: "info",
        text: "🤖 בוט הטלגרם זמין! ניתן לחבר אותו באזור ההגדרות לקבלת התראות לנייד.",
      },
    ]);

    return () => {
      isMounted = false;
    };
  }, [targetUserId]);

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
        dir="rtl"
      >
        <p className="text-gray-400 font-sans text-sm animate-pulse">
          טוען סביבת עבודה אישית...
        </p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div
        className="bg-red-50 p-6 rounded-2xl text-center border border-red-100 max-w-2xl mx-auto"
        dir="rtl"
      >
        <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
      </div>
    );
  }

  const isLimitReached = sites.length >= MAX_SITES_LIMIT;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      {isAdminAction && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center text-amber-900 text-xs font-bold shadow-sm animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <span>
              👀 פנל ניהול: צפייה בדשבורד של לקוח מנוהל (מצב התחזות פעיל)
            </span>
          </div>
          <Link
            href="/admin-panel"
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            חזרה לפנל הניהול ←
          </Link>
        </div>
      )}

      {profile && (
        <WelcomeBanner
          name={profile.name}
          plan={profile.plan}
          sitesCount={sites.length}
          maxLimit={MAX_SITES_LIMIT}
        />
      )}

      <NotificationFeed messages={messages} />

      <QuickActionGate
        isLimitReached={isLimitReached}
        isImpersonating={isAdminAction}
        viewAsId={viewAsId}
      />

      <MonitoredSitesGrid
        sites={sites}
        isImpersonating={isAdminAction}
        viewAsId={viewAsId}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
          dir="rtl"
        >
          <p className="text-gray-400 font-sans text-sm animate-pulse">
            מכין ממשק בקרה...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}