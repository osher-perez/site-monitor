"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AddSiteForm } from "@/components/dashboard/AddSiteForm";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function AddSiteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMaxedOut, setIsMaxedOut] = useState(false);

  const impersonatedUserId = searchParams.get("userId");
  const loggedInUserId = getCookie("userId");
  const userRole = getCookie("userRole");

  const isAdminAction = !!(
    impersonatedUserId &&
    (userRole === "admin" || loggedInUserId === "admin")
  );
  const finalUserId = isAdminAction ? impersonatedUserId : loggedInUserId;

  const MAX_SITES_LIMIT = 3;

  useEffect(() => {
    if (!finalUserId) return;

    fetch(`http://localhost:8000/list-sites?user_id=${finalUserId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((sites) => {
        if (sites.length >= MAX_SITES_LIMIT) {
          setIsMaxedOut(true);
          setMessage(
            `🔒 הגעת למגבלת החבילה החינמית (${MAX_SITES_LIMIT} אתרים). לא ניתן להוסיף אתרים נוספים.`,
          );
        }
      })
      .catch((err) => console.error("Error verifying site limit:", err));
  }, [finalUserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxedOut) return;

    setMessage("🔍 שומר את האתר במערכת ומריץ סריקה ראשונית...");
    setIsLoading(true);

    try {
      if (!finalUserId)
        throw new Error("מזהה משתמש לא נמצא במערכת, אנא התחבר מחדש.");

      const res = await fetch("http://localhost:8000/add-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          user_id: finalUserId.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.detail || "השרת החזיר שגיאה בתהליך השמירה");

      setMessage("✅ האתר נוסף בהצלחה לניטור והופעלה סריקה ראשונית!");
      setUrl("");

      setTimeout(() => {
        router.push(
          isAdminAction
            ? `/dashboard?viewAs=${impersonatedUserId}`
            : "/dashboard",
        );
      }, 2000);
    } catch (err: unknown) {
      console.error("Add Site Error:", err);
      let friendlyMessage = "שגיאה בחיבור לשרת או שהאתר כבר קיים במערכת";
      if (err instanceof Error) friendlyMessage = err.message;
      setMessage(`❌ ${friendlyMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddSiteForm
      url={url}
      setUrl={setUrl}
      message={message}
      isLoading={isLoading}
      isMaxedOut={isMaxedOut}
      isAdminAction={isAdminAction}
      backLink={
        isAdminAction ? `/dashboard?viewAs=${impersonatedUserId}` : "/dashboard"
      }
      handleSubmit={handleSubmit}
    />
  );
}

export default function AddSitePage() {
  return (
    <Suspense
      fallback={
        <div
          className="max-w-xl mx-auto text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
          dir="rtl"
        >
          <p className="text-gray-400 font-mono text-sm animate-pulse">
            טוען ממשק הוספה...
          </p>
        </div>
      }
    >
      <AddSiteContent />
    </Suspense>
  );
}
