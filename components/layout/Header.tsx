"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  ShoppingCart,
  LogIn,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
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
import Image from "next/image";
import logo from "../../images/logo.png";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const { user, logout } = useAuth(); // assure-toi que logout est exposé dans ton AuthContext

  const cartItemsCount = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      user.name?.[0]?.toUpperCase() ||
      "?"
    : null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ferme le menu user si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => setIsSheetOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-md py-2"
          : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logo}
            alt="logo"
            className="h-13 w-20"
            width={90}
            height={90}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/", label: "Accueil" },
            { href: "/menu", label: "Menu" },
            { href: "/catering", label: "Service" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${isScrolled ? "" : "!text-gray-300"} text-foreground/80 hover:text-foreground transition-colors`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Cart */}
          <Link href="/order/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-[0.35rem] py-px min-w-[20px] h-5 flex items-center justify-center bg-primary text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Commander (desktop) */}
          <Button asChild className="hidden md:inline-flex">
            <Link href="/menu">Commander</Link>
          </Button>

          {/* ── USER ZONE (desktop) ── */}
          <div className="hidden md:block relative" ref={userMenuRef}>
            {user ? (
              <>
                {/* Avatar + nom + chevron */}
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:bg-accent transition-colors"
                >
                  {/* Bulle avatar */}
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold select-none">
                    {initials}
                  </span>
                  <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                    {user.firstName || user.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isUserMenuOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Info utilisateur */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Mon profil
                    </Link>

                    <button
                      onClick={() => {
                        logout?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/backend/module/users/ui/login">
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            )}
          </div>
          {/* Mobile Menu Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-border">
                  <SheetTitle className="text-left">
                    <Link href="/" onClick={handleNavClick}>
                      <span className="text-xl font-serif font-medium text-primary">
                        Wingi 
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-6 flex-1">
                  <div className="space-y-6">
                    {[
                      { href: "/", label: "Accueil" },
                      { href: "/menu", label: "Menu" },
                      { href: "/catering", label: "Traiteur" },
                      { href: "/contact", label: "Contact" },
                    ].map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="text-lg font-medium text-foreground py-3 border-b border-border block hover:text-primary transition-colors"
                        onClick={handleNavClick}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 flex flex-col gap-3">
                    {/* ── USER ZONE (mobile) ── */}
                    {user ? (
                      <div className="flex flex-col gap-2 p-4 rounded-xl bg-accent border border-border">
                        {/* Avatar + infos */}
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-base font-semibold">
                            {initials}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        {/* Liens */}
                        <Link
                          href="/profile"
                          onClick={handleNavClick}
                          className="flex items-center gap-2 text-sm py-2 hover:text-primary transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Mon profil
                        </Link>
                        <button
                          onClick={() => {
                            logout?.();
                            handleNavClick();
                          }}
                          className="flex items-center gap-2 text-sm text-destructive py-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Se déconnecter
                        </button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        variant="outline"
                        className="w-full h-12 text-base gap-2"
                      >
                        <Link
                          href="/backend/module/users/ui/login"
                          onClick={handleNavClick}
                        >
                          <LogIn className="h-5 w-5" />
                          Se connecter
                        </Link>
                      </Button>
                    )}
                    <Button asChild className="w-full h-12 text-base">
                      <Link href="/menu" onClick={handleNavClick}>
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
