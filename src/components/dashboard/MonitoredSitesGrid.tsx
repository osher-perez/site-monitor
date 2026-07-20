"use client";

import Link from "next/link";

export interface Site {
  _id?: string;
  id?: string;
  url: string;
  status: string;
  isUp?: boolean;
  last_checked?: string;
  lastChecked?: string;
}

interface MonitoredSitesGridProps {
  sites: Site[];
  isImpersonating: boolean;
  viewAsId: string | null;
}

export const MonitoredSitesGrid = ({
  sites,
  isImpersonating,
  viewAsId,
}: MonitoredSitesGridProps) => {
  if (sites.length === 0) {
    return (
      <div
        className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm"
        dir="rtl"
      >
        <p className="text-gray-400 text-xs font-mono mb-4">
          לא נמצאו כתובות אתר (URLs) פעילות תחת חשבון זה.
        </p>
        <Link
          href={
            isImpersonating
              ? `/dashboard/add-site?userId=${viewAsId}`
              : "/dashboard/add-site"
          }
          className="text-blue-600 hover:underline text-xs font-bold"
        >
          הגדרת אתר לניטור ראשוני ←
        </Link>
      </div>
    );
  }

  return (
    <div
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-right"
      dir="rtl"
    >
      {sites.map((site, index) => {
        // בדיקת תקינות מקיפה שתומכת ב-ONLINE, UP או boolean isUp
        const isOnline =
          site.status === "ONLINE" ||
          site.status === "UP" ||
          site.isUp === true;

        const rawDate = site.last_checked || site.lastChecked;
        const siteId = site._id || site.id;

        // בניית נתיב קישור בטוח (עם support ל-URL ול-ID)
        const viewSiteUrl = siteId
          ? `/dashboard/view-site?id=${siteId}&url=${encodeURIComponent(
              site.url
            )}${isImpersonating ? `&viewAs=${viewAsId}` : ""}`
          : `/dashboard/view-site?url=${encodeURIComponent(
              site.url
            )}${isImpersonating ? `&viewAs=${viewAsId}` : ""}`;

        return (
          <Link key={siteId || index} href={viewSiteUrl} className="group block">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group-hover:border-gray-200 group-hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">
              <div className="flex justify-between items-start mb-6 gap-3">
                <h3 className="font-mono text-sm font-bold truncate w-3/4 text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors">
                  {site.url.replace("https://", "").replace("http://", "")}
                </h3>

                {/* תוויות סטטוס מעודכנות לפי ONLINE / isUp */}
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    isOnline
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-rose-50 text-rose-700 border border-rose-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isOnline
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-rose-500"
                    }`}
                  />
                  {isOnline ? "פעיל" : "ללא תגובה"}
                </span>
              </div>

              <div className="border-t border-gray-50 pt-4 flex justify-between items-center text-gray-400 text-[11px] font-medium">
                <span className="text-blue-600 group-hover:underline">
                  אנליטיקה וסטטיסטיקה ←
                </span>
                <span className="text-gray-400 font-mono">
                  {rawDate
                    ? new Date(rawDate).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "---"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};