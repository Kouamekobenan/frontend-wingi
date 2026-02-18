"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MenuItem from "@/components/menu/MenuItem";
import { categories, menuItems } from "@/lib/data";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
 
  // Set up refs for each category
  useEffect(() => {
    // Check if we have a hash in the URL
    if (window.location.hash) {
      const category = window.location.hash.substring(1);
      if (categories.some(c => c.id === category)) {
        setActiveCategory(category);
        
        // Small delay to ensure the DOM has updated
        setTimeout(() => {
          categoryRefs.current[category]?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, []);
 
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <div className="relative menu h-64 md:h-80 ">
         
          <div className="relative h-full flex flex-col items-center justify-center text-white p-4 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Notre menu</h1>
            <p className="max-w-2xl">
              Découvrez notre sélection de plats préparés avec des produits frais et de saison
            </p>
          </div>
        </div>
        {/* Menu Content */}
        <div className="container mx-auto px-4 py-12">
          <MenuItem/>
          
        </div>
      </main>
      <Footer />
    </>
  );
}