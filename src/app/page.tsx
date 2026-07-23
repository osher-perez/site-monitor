import { HeroSection } from "@/components/public/HeroSection";
import { FreeScanner } from "@/components/public/FreeScanner";
import { FeaturesSection } from "@/components/public/FeaturesSection";
import { PricingSection } from "@/components/public/PricingSection";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900" dir="rtl">
      
      {/* 🚀 מקטע 1: אזור ה-Hero (מרווח מהודק וקרוב) */}
      <section className="pt-10 pb-4 px-4 max-w-5xl mx-auto text-center">
        <HeroSection />
      </section>

      {/* 🔍 מקטע 2: סורק האבחון החינמי */}
      <section className="pb-10 px-4">
        <FreeScanner />
      </section>

      {/* 🛠️ מקטע 3: אזור הפיצ'רים */}
      <section className="py-12 px-4 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <FeaturesSection />
        </div>
      </section>

      {/* 💰 מקטע 4: אזור המחירון */}
      <section className="py-12 px-4 max-w-5xl mx-auto text-center">
        <PricingSection />
      </section>
      
    </div>
  );
}