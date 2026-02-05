"use client";

import Image from "next/image";
import { MapPin, Clock, ChevronDown, Phone } from "lucide-react";
import { type Language } from "@/lib/translations";
import { cn } from "@/lib/utils";
import type { Restaurant } from "@/lib/types";
import { useState, useEffect } from "react";

interface HeaderProps {
  restaurant: Restaurant;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function Header({
  restaurant,
  language,
  onLanguageChange,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative">
      {/* Fixed Floating Navbar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "py-2.5 bg-stone-900 shadow backdrop-blur-xl border-b border-border/30"
            : "py-3 bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 md:w-20 md:h-20">
              <Image
                src={restaurant.logo || "/images/Log.png"}
                alt={restaurant.name}
                fill
                sizes="(max-width: 768px) 64px, 80px"
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl md:text-3xl tracking-wider text-foreground">
                OZ FOOD
              </span>
            </div>
          </div>

          {/* Center - Quick info (hidden on mobile when scrolled) */}
          <div
            className={cn(
              "hidden md:flex items-center gap-4 transition-opacity duration-300",
              isScrolled ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-primary" />
              <span>saint-etienne-du-rouveray</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-emerald-400 font-medium">
                {language === "fr" ? "Ouvert" : "Open"}
              </span>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center rounded-full bg-secondary/80 p-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={cn(
                    "px-2.5 py-1.5 text-[11px] font-semibold tracking-wider rounded-full transition-all duration-200",
                    language === lang.code
                      ? "bg-foreground text-background"
                      : "text-white/80 hover:text-foreground",
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-10 md:pb-16 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="max-w-xl animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/15 border border-primary/20 mb-5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  {language === "fr"
                    ? "Viande cuite au feu de bois"
                    : "Wood-fired meat"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-3 leading-[0.9]">
                <span className="block">
                  {language === "fr" ? "SAVEURS" : "FLAVORS"}
                </span>
                <span className="block text-primary">
                  {language === "fr" ? "AUTHENTIQUES" : "AUTHENTIC"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-foreground/60 mb-6 max-w-md leading-relaxed">
                {language === "fr"
                  ? "Kebabs, Burgers, Tacos - Le meilleur du fast food artisanal"
                  : "Kebabs, Burgers, Tacos - The best artisanal fast food"}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    document
                      .getElementById("menu-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold text-sm rounded-full transition-all duration-300 hover:scale-105"
                >
                  {language === "fr" ? "COMMANDER" : "ORDER NOW"}
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-border/20">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 backdrop-blur-sm text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground/70">saint-etienne-du-rouveray</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/40 backdrop-blur-sm text-sm">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-foreground/70">
                    {language === "fr" ? "7j/7 • 11h-14h, 18h-2h" : "7/7 • 11 AM–2 PM, 6 PM–2 AM"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-400 font-medium">
                    {language === "fr" ? "Livraison gratuite dès 20€" : "Free delivery from 20€"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-60">
          <ChevronDown className="w-5 h-5 text-foreground" />
        </div>
      </div>
    </header>
  );
}
