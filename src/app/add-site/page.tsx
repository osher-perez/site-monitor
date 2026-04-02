"use client";

import { useState } from "react";

export default function AddSite() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`האתר שנשלח לבדיקה: ${url}`);
    // בהמשך כאן נשלח את הנתונים לפייתון או ל-MongoDB
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">הוספת אתר חדש לניטור</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">כתובת האתר (URL):</label>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition duration-200"
        >
          הוסף ובדוק סטטוס
        </button>
      </form>
    </div>
  );
}