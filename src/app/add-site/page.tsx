"use client";
import { useState } from "react";

export default function AddSite() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("🔍 בודק סטטוס...");
    try {
      const res = await fetch(
        `http://localhost:8000/check?url=${encodeURIComponent(url)}`,
      );
      const data = await res.json();
      setMessage(
        data.status === "UP"
          ? "✅ האתר נוסף והוא באוויר!"
          : "⚠️ האתר נוסף אך נראה שהוא למטה",
      );
      setUrl("");
    } catch (err) {
      setMessage("❌ שגיאה בחיבור לשרת הפייתון");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-10 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          הוספת אתר לניטור
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 font-medium">
              כתובת ה-URL:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="https://example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition"
          >
            בדוק והוסף לרשימה
          </button>
        </form>
        {message && (
          <div className="mt-6 text-center text-white bg-gray-900/50 py-3 rounded-lg font-semibold">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
