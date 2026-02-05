"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/menu/header";
import { CategoryNav } from "@/components/menu/category-nav";
import { ChefRecommendations } from "@/components/menu/chef-recommendations";
import { MenuSection } from "@/components/menu/menu-section";
import { EmptyState } from "@/components/menu/empty-state";
import { SplashScreen } from "@/components/menu/splash-screen";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { CartButton } from "./cart-button";
import { CheckoutModal } from "./checkout-modal";
import { Flame, Star, Zap } from "lucide-react";

import type { Category, MenuItem, Restaurant } from "@/lib/types";
import { useMenuFiltering } from "@/hooks/use-menu-filtering";
import { Language } from "@/lib/translations";
import { useCart } from "@/contexts/cart-context";
import { ModalProvider } from "@/contexts/modal-context";

interface MenuPageClientProps {
  restaurant: Restaurant;
  categories: Category[];
  menuItems: MenuItem[];
}

export function MenuPageClient({
  restaurant,
  categories,
  menuItems,
}: MenuPageClientProps) {
  const { setRestaurantSlug, setCurrency } = useCart();
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    if (restaurant?.slug) {
      setRestaurantSlug(restaurant.slug);
    }
    if (restaurant?.currency) {
      setCurrency(restaurant.currency);
    }
  }, [restaurant?.slug, restaurant?.currency, setRestaurantSlug, setCurrency]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const { chefRecommendations, filteredCategories } = useMenuFiltering(
    categories,
    menuItems
  );

  // Debug: Log menu items to verify sauces/cheeses are coming from API
  useEffect(() => {
    if (menuItems?.length > 0) {
      const itemsWithSauces = menuItems.filter(item => item.sauces && item.sauces.length > 0);
      const itemsWithCheeses = menuItems.filter(item => item.cheeses && item.cheeses.length > 0);
      console.log("[v0] Menu items with sauces:", itemsWithSauces.length);
      console.log("[v0] Menu items with cheeses:", itemsWithCheeses.length);
      if (itemsWithSauces.length > 0) {
        console.log("[v0] Sample item with sauces:", itemsWithSauces[0]);
      }
    }
  }, [menuItems]);

  // Create "All" category option for full menu
  const allCategoriesWithAll = [
    {
      id: "all",
      nameEn: "Full Menu",
      nameFr: "Tout le menu",
      restaurantId: restaurant.id,
      visible: true,
      order: -1,
      isActive: true,
    } as Category,
    ...filteredCategories,
  ];

  // Filter to show only the active category or all if "all" is selected
  const displayCategories = activeCategory === "all"
    ? filteredCategories
    : filteredCategories.filter(cat => cat.id === activeCategory);

  const hasResults = displayCategories.length > 0;
  const showChefRecommendations = activeCategory === "all" && chefRecommendations.length > 0;

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ModalProvider>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Fixed noise texture */}
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none bg-noise z-0" />
      
      <Header
        restaurant={restaurant}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Menu Section Intro */}
      <div id="menu-section" className="relative py-12 md:py-16 ">
        {/* Background glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.06) 0%, transparent 70%)",
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative">
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 mb-6">
            <Flame className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              {language === "fr" ? "Notre Carte" : "Our Menu"}
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground tracking-wide mb-4">
            {language === "fr" ? "FAITES VOTRE CHOIX" : "MAKE YOUR CHOICE"}
          </h2>
          
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            {language === "fr" 
              ? "Des ingrédients frais, des recettes authentiques, un goût incomparable"
              : "Fresh ingredients, authentic recipes, unmatched taste"
            }
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">4.8/5</div>
                <div className="text-xs text-muted-foreground">
                  {language === "fr" ? "Note clients" : "Rating"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">15-25min</div>
                <div className="text-xs text-muted-foreground">
                  {language === "fr" ? "Préparation" : "Prep time"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-foreground">100%</div>
                <div className="text-xs text-muted-foreground">
                  {language === "fr" ? "Fait maison" : "Homemade"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasResults && (
        <CategoryNav
          categories={allCategoriesWithAll}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryClick}
          language={language}
        />
      )}

      <main className="pb-28 relative">
        {showChefRecommendations && (
          <ChefRecommendations
            items={chefRecommendations}
            language={language}
          />
        )}

        {hasResults ? (
          displayCategories.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              language={language}
            />
          ))
        ) : (
          <EmptyState language={language} />
        )}
      </main>

      <Footer restaurant={restaurant} language={language} />

      <CartButton language={language} />
      <CartDrawer language={language} />
      <CheckoutModal language={language} />
      </div>
    </ModalProvider>
  );
}
