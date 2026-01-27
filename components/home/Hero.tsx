"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Utensils,
  Sparkles,
  Heart,
} from "lucide-react";
import wingi58 from "@/images/menu/Wingi-58.jpg";
import wingi18 from "@/images/menu/Wingi-18.jpg";
import wingi2 from "@/images/menu/Wingi-2.jpg";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false); // Pour corriger l'erreur Hydration
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
    setMounted(true); // Indique que le composant est chargé sur le client
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
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
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[200px] lg:min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Overlay floral/ethnique subtil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIHN0cm9rZS13aWR0aD0iMSI+PHBhdGggZD0iTTIwLDIwIEMzMCwxMCA0MCwxMCA1MCwyMCBDNDAsMzAgMzAsMzAgMjAsMjAgWiIvPjxwYXRoIGQ9Ik0xMCwxMCBDMTUsNSA0MCw1IDUwLDE1Ii8+PC9nPjwvc3ZnPg==')] opacity-20 mix-blend-overlay z-10"></div>

      {/* Conteneur des images */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-110"
            }`}
            style={{
              backgroundImage: `url('${slide.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "brightness(0.7) contrast(1.1)",
              transform: index === currentSlide ? "scale(1)" : "scale(1.1)",
              transition: "opacity 1s ease-in-out, transform 8s ease-in-out",
            }}
            aria-hidden={index !== currentSlide}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>

            {/* Particules - Corrigé pour éviter l'erreur d'hydratation */}
            <div className="absolute inset-0 overflow-hidden">
              {mounted &&
                [1, 2, 3, 4, 5].map((i) => (
                  <Sparkles
                    key={i}
                    className="absolute text-yellow-400 opacity-20 animate-float"
                    style={{
                      top: `${(i * 15) % 100}%`,
                      left: `${(i * 20) % 100}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${5 + i}s`,
                    }}
                    size={20}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Élément décoratif culinaire */}
      <div className="absolute top-10 right-10 z-20 opacity-30 animate-pulse">
        <Utensils className="h-16 w-16 text-amber-400 rotate-12" />
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-amber-600/80 backdrop-blur-sm transition-all duration-300 group"
        aria-label="Image précédente"
      >
        <ChevronLeft className="h-7 w-7 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-black/20 text-white hover:bg-amber-600/80 backdrop-blur-sm transition-all duration-300 group"
        aria-label="Image suivante"
      >
        <ChevronRight className="h-7 w-7 group-hover:scale-110 transition-transform" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 w-8 rounded-full transition-all duration-500 ${
              index === currentSlide
                ? "bg-amber-500 scale-110 shadow-lg"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Aller à l'image ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Content - Taille identique à l'original (py-20) */}
      <div className="container mx-auto px-4 relative z-10 text-center py-20">
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-400/30 animate-fade-in">
            <Heart
              className="h-4 w-4 text-amber-500 mr-2"
              fill="currentColor"
            />
            <span className="text-amber-300 text-sm font-medium">
              Nouveau menu saisonnier
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-tight">
            <span className="block animate-fade-in-up delay-100">
              {slides[currentSlide].title}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-300">
            {slides[currentSlide].description}
            <span className="block mt-2 text-amber-300 font-medium">
              Service de commande en ligne et traiteur.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
            <Button
              size="lg"
              asChild
              className="rounded-full text-base bg-amber-600 hover:bg-amber-700 shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/menu" className="flex items-center">
                <Utensils className="mr-2 h-5 w-5" />
                Découvrir le menu
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full text-base bg-transparent text-white border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1"
            >
              <Link href="/catering">Decouvrir notre catalogues</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Indication de défilement */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-amber-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-400 rounded-full mt-2 animate-scroll"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scroll {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(5px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
