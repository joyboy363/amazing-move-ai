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
    <>
      <ScrollVideoBackground />
      <div className="video-mode min-h-screen" style={{ position: "relative", zIndex: 1 }}>
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
    </>
  );
};

export default Index;
