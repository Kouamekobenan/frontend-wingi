"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  Heart,
} from "lucide-react";
import wingi58 from "@/images/menu/Wingi-58.jpg";
import wingi18 from "@/images/menu/Wingi-18.jpg";
import wingi2 from "@/images/menu/Wingi-2.jpg";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef(null);

  const slides = [
    {
      image: wingi58.src,
      alt: "Cuisine africaine raffinée",
      title: "Une expérience culinaire africaine",
      description:
        "Découvrez notre cuisine raffinée élaborée avec des produits frais et de saison.",
    },
    {
      image: wingi18.src,
      alt: "Plat traditionnel africain",
      title: "Saveurs authentiques",
      description:
        "Des recettes traditionnelles revisitées avec une touche contemporaine.",
    },
    {
      image: wingi2.src,
      alt: "Service traiteur événementiel",
      title: "Événements mémorables",
      description:
        "Service traiteur d'exception pour toutes vos occasions spéciales.",
    },
  ];

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 1000);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <section
      ref={heroRef}
      /* CHANGEMENT : Hauteur contrôlée au lieu de screen */
      className="relative h-[450px] lg:h-[550px] flex items-center justify-center overflow-hidden"
    >
      {/* Overlay floral */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTIwLDIwIEMzMCwxMCA0MCwxMCA1MCwyMCBDNDAsMzAgMzAsMzAgMjAsMjAgWiIvPjxwYXRoIGQ9Ik0xMCwxMCBDMTUsNSA0MCw1IDUwLDE1Ii8+PC9nPjwvc3ZnPg==')] opacity-20 mix-blend-overlay z-10"></div>

      {/* Conteneur des images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.65) contrast(1.1)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          </div>
        ))}
      </div>

      {/* Navigation - Taille réduite pour discrétion */}
      <button
        onClick={prevSlide}
        className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-amber-600/80 backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 text-white hover:bg-amber-600/80 backdrop-blur-sm transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content - Padding réduit */}
      <div className="container mx-auto px-4 relative z-10 text-center py-12">
        <div
          className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-md px-3 py-1 rounded-full mb-4 border border-amber-400/30">
            <Heart
              className="h-3 w-3 text-amber-500 mr-2"
              fill="currentColor"
            />
            <span className="text-amber-300 text-xs font-medium tracking-wide uppercase">
              Nouveau menu saisonnier
            </span>
          </div>

          {/* CHANGEMENT : Tailles de texte plus compactes */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 tracking-tight leading-tight max-w-4xl mx-auto">
            {slides[currentSlide].title}
          </h1>

          <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
            {slides[currentSlide].description}
            <span className="hidden md:block mt-2 text-amber-300 font-medium">
              Service de commande en ligne et traiteur.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-amber-600 hover:bg-amber-700 shadow-lg transition-transform hover:-translate-y-1 px-8"
            >
              <Link href="/menu">
                <Utensils className="mr-2 h-4 w-4" /> Découvrir le menu
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full bg-white/5 text-white border-white/40 hover:bg-white/10 backdrop-blur-sm px-8"
            >
              <Link href="/catering">Nos catalogues</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Indicateurs - Plus bas et plus petits */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              index === currentSlide ? "w-8 bg-amber-500" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
