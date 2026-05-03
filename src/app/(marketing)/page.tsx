import { HeroSection } from "@/components/marketing/HeroSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PricingSection } from "@/components/marketing/PricingSection";

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          
          <HeroSection />

          <FeaturesSection />

          <PricingSection />

          {/* כאן תוכל להוסיף בעתיד בקלות: <TestimonialsSection /> או <FAQSection /> */}
          

        </div>
      </div>
    </div>
  );
}