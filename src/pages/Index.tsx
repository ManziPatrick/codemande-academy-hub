import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { FeaturesBar } from "@/components/home/FeaturesBar";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TrainingProcess } from "@/components/home/TrainingProcess";
import { InternshipsSection } from "@/components/home/InternshipsSection";
import { WhoWeServe } from "@/components/home/WhoWeServe";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <FeaturesBar />
        <AboutSection />
        <ServicesSection />
        <WhyChooseSection />
        <TrainingProcess />
        <InternshipsSection />
        <WhoWeServe />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
