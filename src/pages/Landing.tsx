import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { RegistrationSection } from "@/components/landing/RegistrationSection";
import { Footer } from "@/components/ui/footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <ContactSection />
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;