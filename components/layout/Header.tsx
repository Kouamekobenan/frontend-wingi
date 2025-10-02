"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from 'next/image';
import logo from '@/images/logo.png';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { items } = useCart();
  
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="logo" className='h-13 w-20'/>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Accueil
          </Link>
          <Link href="/menu" className="text-foreground/80 hover:text-foreground transition-colors">
            Menu
          </Link>
          <Link href="/catering" className="text-foreground/80 hover:text-foreground transition-colors">
           {/* Traiteur */}
          </Link>
          <Link href="/contact" className="text-foreground/80 hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Link href="/order/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 px-[0.35rem] py-px min-w-[20px] h-5 flex items-center justify-center bg-primary text-xs"
                  variant="default"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          <Button asChild className="hidden md:inline-flex">
            <Link href="/order">Commander</Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-left">
                    <Link href="/" onClick={handleNavClick}>
                      <span className="text-xl font-serif font-medium text-primary">
                        Wingi food
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col p-6 flex-1">
                  <div className="space-y-6">
                    <Link
                      href="/"
                      className="text-lg font-medium text-foreground py-3 border-b border-border block hover:text-primary transition-colors"
                      onClick={handleNavClick}
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/menu"
                      className="text-lg font-medium text-foreground py-3 border-b border-border block hover:text-primary transition-colors"
                      onClick={handleNavClick}
                    >
                      Menu
                    </Link>
                    <Link
                      href="/catering"
                      className="text-lg font-medium text-foreground py-3 border-b border-border block hover:text-primary transition-colors"
                      onClick={handleNavClick}
                    >
                      Traiteur
                    </Link>
                    <Link
                      href="/contact"
                      className="text-lg font-medium text-foreground py-3 border-b border-border block hover:text-primary transition-colors"
                      onClick={handleNavClick}
                    >
                      Contact
                    </Link>
                  </div>

                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full h-12 text-base">
                      <Link href="/order" onClick={handleNavClick}>
                        Commander en ligne
                      </Link>
                    </Button>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}