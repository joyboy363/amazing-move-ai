import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import QuoteCalculator from "@/components/QuoteCalculator";
import Testimonials from "@/components/Testimonials";
import BookingFlow from "@/components/BookingFlow";
import AIChatbot from "@/components/AIChatbot";
import StickyContact from "@/components/StickyContact";
import Footer from "@/components/Footer";
import { ScrollVideoBackground } from "@/components/ScrollVideoBackground";

const Index = () => {
  return (
    <div className="relative min-h-screen video-mode">
      {/* Fixed video background */}
      <ScrollVideoBackground />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 bg-black/50 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Scrollable content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <Hero />
        <Services />
        <WhyChooseUs />
        <QuoteCalculator />
        <Testimonials />
        <BookingFlow />
        <Footer />
        <StickyContact />
        <AIChatbot />
      </div>
    </div>
  );
};

export default Index;
