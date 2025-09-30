import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedItems from "@/components/home/FeaturedItems";
import AboutSection from "@/components/home/AboutSection";
import CateringPromo from "@/components/home/CateringPromo";
import Testimonials from "@/components/home/Testimonials";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Header />
      <main>
        <Hero />
        <FeaturedItems />
        <AboutSection />
        <CateringPromo />
        <Testimonials />
      </main>
      <Footer />
    </ThemeProvider>
  );
}