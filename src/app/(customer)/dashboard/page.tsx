"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ייבוא הקומפוננטות המבודדות מהארכיטקטורה החדשה
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { NotificationFeed, SystemMessage } from "@/components/dashboard/NotificationFeed";
import { QuickActionGate } from "@/components/dashboard/QuickActionGate";
import { MonitoredSitesGrid } from "@/components/dashboard/MonitoredSitesGrid";

interface Site {
  url: string;
  status: string;
  last_checked: string;
}

interface UserProfile {
  name: string;
  email: string;
  plan: string;
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
  
  const [sites, setSites] = useState<Site[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<SystemMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const MAX_SITES_LIMIT = 3; 

  useEffect(() => {
    const loggedInUserId = getCookie("userId");
    const userRole = getCookie("userRole");
    let targetUserId = loggedInUserId;

    if (viewAsId && (userRole === "admin" || loggedInUserId === "admin")) {
      targetUserId = viewAsId;
      setTimeout(() => setIsImpersonating(true), 0);
    }

    if (!targetUserId) {
      setTimeout(() => {
        setErrorMsg("מזהה משתמש לא נמצא. נא להתחבר מחדש.");
        setLoading(false);
      }, 0);
      return;
    }

    // קריאות שרת לפייתון
    const fetchProfile = fetch(`http://localhost:8000/user-profile?user_id=${targetUserId}`)
      .then((res) => (res.ok ? res.json() : { name: "משתמש מחובר", email: "", plan: "בסיסי (חינם)" }))
      .then((data) => setProfile(data));

    const fetchSites = fetch(`http://localhost:8000/list-sites?user_id=${targetUserId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setSites(data));

    setTimeout(() => {
      setMessages([
        { id: "1", type: "success", text: "🔒 מערכת הניטור פועלת בצורה מאובטחת וחסינה." },
        { id: "2", type: "info", text: "🤖 בוט הטלגרם זמין! ניתן לחבר אותו באזור ההגדרות לקבלת התראות לנייד." }
      ]);
    }, 0);

    Promise.all([fetchProfile, fetchSites])
      .then(() => setLoading(false))
      .catch(() => {
        setErrorMsg("לא ניתן ליצור קשר עם שרת הניטור.");
        setLoading(false);
      });
  }, [viewAsId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">טוען סביבת עבודה אישית...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl text-center border border-red-100 max-w-2xl mx-auto" dir="rtl">
        <p className="text-red-600 text-sm font-medium">{errorMsg}</p>
      </div>
    );
  }

  const isLimitReached = sites.length >= MAX_SITES_LIMIT;

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-right" dir="rtl">
      
      {/* באנר מצב אדמין */}
      {isImpersonating && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex justify-between items-center text-amber-900 text-xs font-bold shadow-sm">
          <span>👀 פנל ניהול: צפייה בדשבורד של לקוח מנוהל</span>
          <Link href="/admin-panel" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl transition-all">
            חזרה לפנל הניהול ←
          </Link>
        </div>
      )}

      {/* 👤 קומפוננטה 1: ברוך הבא וסטטוס מנוי */}
      {profile && (
        <WelcomeBanner 
          name={profile.name} 
          plan={profile.plan} 
          sitesCount={sites.length} 
          maxLimit={MAX_SITES_LIMIT} 
        />
      )}

      {/* 🔔 קומפוננטה 2: פיד הודעות מערכת */}
      <NotificationFeed messages={messages} />

      {/* 🔒 קומפוננטה 4: כותרת וכפתור הוספה (אוכף מגבלות ושומר שיוך משתמש) */}
      <QuickActionGate 
        isLimitReached={isLimitReached} 
        isImpersonating={isImpersonating} 
        viewAsId={viewAsId} 
      />

      {/* 🌐 קומפוננטה 3: גריד כרטיסי האתרים */}
      <MonitoredSitesGrid 
        sites={sites} 
        isImpersonating={isImpersonating} 
        viewAsId={viewAsId} 
      />

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm" dir="rtl">
        <p className="text-gray-400 font-mono text-sm animate-pulse">מכין ממשק בקרה...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}