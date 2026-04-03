"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Site {
  url: string;
  status: string;
  last_checked: string;
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/list-sites")
      .then((res) => res.json())
      .then((data) => {
        setSites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">לוח בקרה (Dashboard)</h1>
        <Link
          href="/add-site"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold transition shadow-lg"
        >
          + הוסף אתר חדש
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-white text-xl">טוען נתונים...</p>
      ) : sites.length === 0 ? (
        <div className="bg-gray-800 p-10 rounded-xl text-center border border-gray-700">
          <p className="text-gray-300 text-lg italic">
            אין אתרים ברשימה. הגיע הזמן להוסיף אחד!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white">
          {sites.map((site, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl hover:scale-105 transition-transform duration-200"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-mono text-lg font-semibold truncate w-3/4 text-white uppercase tracking-tight">
                  {site.url.replace("https://", "").replace("http://", "")}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase shadow-sm ${
                    site.status === "UP"
                      ? "bg-green-500 text-green-950"
                      : "bg-red-500 text-red-950"
                  }`}
                >
                  {site.status}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4 flex justify-between items-center text-gray-400 text-sm">
                <span>בדיקה אחרונה:</span>
                <span className="text-white font-medium">
                  {new Date(site.last_checked).toLocaleTimeString("he-IL")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
