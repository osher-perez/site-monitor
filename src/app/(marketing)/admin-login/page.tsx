'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // הצלחנו! ה-Cookie כבר הוגדר ע"י השרת
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('סיסמה שגויה. הגישה נדחתה.');
      }
    } catch (err) {
      setError('שגיאת תקשורת. נסה שוב.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 px-4 text-right" dir="rtl">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">כניסת מנהל מערכת</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמת ניהול</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={isLoading ? 'בודק...' : 'הכנס סיסמה...'}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg font-bold transition text-white ${
              isLoading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'
            }`}
          >
            {isLoading ? 'מתחבר...' : 'התחבר למערכת'}
          </button>
        </form>
      </div>
    </div>
  );
}