"use client";

import { useState } from "react";
import Image from "next/image";
import { Flame, Leaf, Star, Award, Plus, Check } from "lucide-react";
import { type Language } from "@/lib/translations";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  language: Language;
  variant?: "default" | "featured";
  onItemClick?: (item: MenuItem) => void;
}

function formatPrice(price: number | string | null | undefined): string {
  const numPrice = typeof price === "number" ? price : parseFloat(String(price || 0));
  return numPrice.toFixed(2);
}

export function MenuItemCard({
  item,
  language,
  variant = "default",
  onItemClick,
}: MenuItemCardProps) {
  const { addItem, items, currency } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const nameMap = { en: item.nameEn, fr: item.nameFr };
  const descriptionMap = { en: item.descriptionEn, fr: item.descriptionFr };

  const name = nameMap[language] ?? "";
  const description = descriptionMap[language] ?? "";

  // Find all cart items for this menu item (may have multiple with different options)
  const cartItemsForThisItem = items.filter((ci) => ci.item.id === item.id);
  const totalQuantityInCart = cartItemsForThisItem.reduce((sum, ci) => sum + ci.quantity, 0);
  const inCart = totalQuantityInCart > 0;

  // Check if item has sauces or cheeses that require selection
  const hasModifierOptions = (item.sauces?.length ?? 0) > 0 || (item.cheeses?.length ?? 0) > 0;
  
  // Check if item has supplements (requires modal for selection)
  const hasSupplements = (item.supplements?.length ?? 0) > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If item has modifier options (sauces/cheeses) or supplements, force opening the modal instead of quick add
    if ((hasModifierOptions || hasSupplements) && onItemClick) {
      onItemClick(item);
      return;
    }
    
    addItem(item, 1);
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1200);
  };

  const handleCardClick = () => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  // Featured variant for carousel
  if (variant === "featured") {
    return (
      <div
        onClick={handleCardClick}
        className={cn(
          "group relative h-full bg-card rounded-2xl overflow-hidden border border-border/30",
          "transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
          onItemClick && "cursor-pointer"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {item.image ? (
            <Image
              src={item.image}
              alt={name || ""}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {item.isChefRecommendation && (
              <div className="flex items-center gap-1 bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-full">
                <Award className="w-3 h-3" />
              </div>
            )}
            {item.isPopular && (
              <div className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-current" />
              </div>
            )}
          </div>

          {inCart && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <Check className="w-3 h-3" />
              {totalQuantityInCart}
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-lg leading-tight mb-1 line-clamp-1 drop-shadow-lg">
                {name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary drop-shadow-lg">{formatPrice(item.price)}</span>
                <span className="text-sm text-foreground/70">{currency}</span>
              </div>
            </div>
            <button
              onClick={handleQuickAdd}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                showAdded
                  ? "bg-emerald-500 text-white scale-110"
                  : "bg-primary text-primary-foreground hover:scale-110"
              )}
            >
              {showAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default - Modern card design (for grid layout)
  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative h-full bg-card rounded-2xl overflow-hidden border border-border/20",
        "transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
        onItemClick && "cursor-pointer"
      )}
    >
      {/* Image section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {item.image ? (
          <Image
            src={item.image}
            alt={name || ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Badges - top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.isChefRecommendation && (
            <div className="flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-amber-950 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-full shadow-md">
              <Award className="w-3 h-3" />
              <span className="hidden sm:inline">Chef</span>
            </div>
          )}
          {item.isPopular && (
            <div className="flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-full shadow-md">
              <Star className="w-3 h-3 fill-current" />
              <span className="hidden sm:inline">Popular</span>
            </div>
          )}
        </div>

        {/* In cart indicator */}
        {inCart && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-md">
            <Check className="w-3.5 h-3.5" />
            <span>{totalQuantityInCart}</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Name */}
        <h3 className="font-semibold text-foreground text-lg leading-tight mb-1.5 line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-base text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {(item.isSpicy || item.isVegetarian) && (
          <div className="flex items-center gap-2 mb-3">
            {item.isSpicy && (
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <Flame className="w-4 h-4" />
                {language === "fr" ? "Piquant" : "Spicy"}
              </span>
            )}
            {item.isVegetarian && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <Leaf className="w-4 h-4" />
                {language === "fr" ? "Végé" : "Veg"}
              </span>
            )}
          </div>
        )}

        {/* Price & Add button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{formatPrice(item.price)}</span>
            <span className="text-base text-muted-foreground">{currency}</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
              showAdded
                ? "bg-emerald-500 text-white scale-110"
                : "bg-primary text-primary-foreground hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
            )}
          >
            {showAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
