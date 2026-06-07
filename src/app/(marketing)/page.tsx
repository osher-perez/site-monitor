import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import Link from "next/link"; // ייבוא הקומפוננטה למעבר מהיר בין דפים

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white transition-colors duration-500 text-right" dir="rtl">
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          
          {/* אזור הפתיחה וההסברים */}
          <HeroSection />
          
          {/* פיצ'רים של המערכת */}
          <FeaturesSection />

          {/* 🚀 כפתור קריאה לפעולה מרכזי שמוביל לעמוד ה-auth שבדקנו קודם! */}
          <div className="py-6">
            <Link 
              href="/auth" 
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              התחל לנטר בחינם ←
            </Link>
            <p className="text-xs text-gray-400 mt-2">הקמת חשבון מהירה ב-30 שניות, ללא כרטיס אשראי</p>
          </div>
          
          {/* טבלת המחירים */}
          <PricingSection />
          
          {/* כאן תוכל להוסיף בעתיד בקלות: <TestimonialsSection /> או <FAQSection /> */}
        </div>
      </div>
    </div>
  );
}