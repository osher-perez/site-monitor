"use client";

import { HeroSection } from "@/components/marketing/HeroSection";
import { FreeScanner } from "@/components/marketing/FreeScanner";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PricingSection } from "@/components/marketing/PricingSection";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 text-right" dir="rtl">
      {/* 🚀 מקטע 1: אזור ה-Hero (הרושם הראשוני והסבר הליבה) */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <HeroSection />
      </section>

      {/* 🔍 מקטע 2: סורק האבחון החינמי (הנעה אינטראקטיבית לפעולה) */}
      <section className="pb-16 px-4">
        <FreeScanner />
      </section>

      {/* 🛠️ מקטע 3: אזור הפיצ'רים (העמקה טכנולוגית ויכולות המערכת) */}
      <section className="py-16 px-4 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <FeaturesSection />
        </div>
      </section>

      {/* 💰 מקטע 4: אזור המחירון (חבילות, מחירים ומגבלות החבילה החינמית) */}
      <section className="py-20 px-4 max-w-6xl mx-auto text-center">
        <PricingSection />
      </section>
    </div>
  );
}
