import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/features/HeroSection";
import ServicesHighlight from "@/components/features/ServicesHighlight";
import FeaturedWork from "@/components/features/FeaturedWork";
import TestimonialsPreview from "@/components/features/TestimonialsPreview";
import CTABanner from "@/components/features/CTABanner";
import WhyUs from "@/components/features/WhyUs";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesHighlight />
      <WhyUs />
      <FeaturedWork />
      <TestimonialsPreview />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default Index;
