"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MenuProduct from "@/components/menu/MenuProduct";
import { categories, menuItems } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Filter menu items by category
  const filteredItems = menuItems.filter(item => item.category === activeCategory);
  
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
  
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    categoryRefs.current[categoryId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  
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
        
        {/* Category Navigation */}
        <div className="sticky top-16 z-20 bg-background shadow-sm">
          <div className="container mx-auto px-4 overflow-x-auto py-4">
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => scrollToCategory(category.id)}
                  className="whitespace-nowrap rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Menu Content */}
        <div className="container mx-auto px-4 py-12">
          {categories.map((category) => (
            <div 
              key={category.id} 
              id={category.id}
              ref={(el) => {
                categoryRefs.current[category.id] = el;
              }}
              className="mb-16"
            >
              <h2 className="text-2xl font-serif font-semibold mb-2">{category.name}</h2>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              
              <div className="space-y-4">
                {menuItems
                  .filter(item => item.category === category.id)
                  .map((item) => (
                    <MenuProduct key={item.id} item={item} showAddButton />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}