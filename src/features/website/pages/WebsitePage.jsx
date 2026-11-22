import { useEffect, useState } from "react";
import { Icon } from "@/components/ui";
import WebHeader from "../components/WebHeader";
import WebFooter from "../components/WebFooter";
import HeroSection from "../components/HeroSection";
import AppInfoSection from "../components/AppInfoSection";
import AboutSection from "../components/AboutSection";
import FeaturesSection from "../components/FeaturesSection";
import ScreensSection from "../components/ScreensSection";
import HowItWorksSection from "../components/HowItWorksSection";
import WhyChooseSection from "../components/WhyChooseSection";
import DownloadSection from "../components/DownloadSection";
import ReviewsSection from "../components/ReviewsSection";

export default function WebsitePage() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 100);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <WebHeader />

      <a
        href="#"
        aria-label="Back to top"
        onClick={scrollToTop}
        className={`fixed right-5 bottom-5 z-1000 size-11.25 rounded-[0.625rem] bg-[#3f68b3] text-center text-[24px] leading-12.5 text-white transition-all duration-300 ${showBackToTop ? "block" : "hidden"}`}
      >
        <Icon name="up" className="mx-auto h-full" />
      </a>

      <main>
        <HeroSection />
        <AppInfoSection />
        <AboutSection />
        <FeaturesSection />
        <ScreensSection />
        <HowItWorksSection />
        <WhyChooseSection />
        <DownloadSection />
        <ReviewsSection />
      </main>

      <WebFooter />
    </>
  );
}
