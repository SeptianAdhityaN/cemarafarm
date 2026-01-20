import HeroSection from "@/components/landing/hero-section";
import ValueSection from "@/components/landing/value-section";
import ActivitySection from "@/components/landing/activity-section";
// import CTASection from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <main className="space-y-32 pb-32">
      <HeroSection />
      <ValueSection />
      <ActivitySection />
      {/* <CTASection /> */}
    </main>
  );
}
