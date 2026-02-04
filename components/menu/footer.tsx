import Image from "next/image";
import { translations, type Language } from "@/lib/translations";
import type { Restaurant } from "@/lib/types";
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  restaurant: Restaurant;
  language?: Language;
}

export function Footer({ restaurant, language = "fr" }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="relative py-16 bg-stone-900 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className=" mx-auto">
          {/* Top section */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-12">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={restaurant.logo || "/images/Log.png"}
                    alt={restaurant.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <span className="font-display text-xl tracking-wider text-white">
                  OZ FOOD
                </span>
              </div>
              <p className="text-sm text-white/80 text-center md:text-left max-w-xs">
                {language === "fr"
                  ? "Viande maison cuite au feu de bois. Le meilleur du fast food artisanal."
                  : "Homemade wood-fired meat. The best of artisanal fast food."}
              </p>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-4">
              <a
                href="https://maps.google.com/?q=49+rue+Lazare+Carnot+Saint-Etienne"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/80  hover:text-foreground transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">
                  49 rue Lazare Carnot, Saint-Etienne
                </span>
              </a>
              <a
                href="tel:0951342463"
                className="flex items-center gap-3 text-white/80  hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-medium">09 51 34 24 63</span>
              </a>
              <div className="flex items-center gap-3 text-white/80 ">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm">
                  {language === "fr"
                    ? "Ouvert 6j/7 - Fermé le lundi"
                    : "Open 6 days/week - Closed Monday"}
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/ozfood76"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-white/80 hover:text-primary hover:border-primary/50 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-white/80 hover:text-primary hover:border-primary/50 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-6 border-t border-border/30 ">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
              <p className="text-xs text-white/70">
                {new Date().getFullYear()} OZ Food.{" "}
                {language === "fr"
                  ? "Tous droits réservés."
                  : "All rights reserved."}
              </p>

              <p className="text-xs text-white/70">
                Powered by{" "}
                <span className="font-semibold text-foreground">H2A</span>
              </p>
              <p className="text-xs text-white/70">
                {language === "fr" ? "Fait avec" : "Made with"}{" "}
                <span className="text-primary">&#9829;</span>{" "}
                {language === "fr" ? "à Saint-Etienne" : "in Saint-Etienne"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
