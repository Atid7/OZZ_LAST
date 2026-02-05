"use client";

import Image from "next/image";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Flame, Droplets, CircleDot, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/cart-context";
import { Language, translations } from "@/lib/translations";
import { SauceType, CheeseType } from "@/lib/types";
import { cn } from "@/lib/utils";

// Display names for sauce types (matching backend Prisma schema)
const SAUCE_DISPLAY_NAMES: Record<SauceType, { en: string; fr: string }> = {
  MUSTARD: { en: "Mustard", fr: "Moutarde" },
  SOY_SAUCE: { en: "Soy Sauce", fr: "Sauce Soja" },
  MAYONNAISE: { en: "Mayonnaise", fr: "Mayonnaise" },
  BARBECUE: { en: "BBQ Sauce", fr: "Sauce BBQ" },
  KETCHUP: { en: "Ketchup", fr: "Ketchup" },
  HOT_SAUCE: { en: "Hot Sauce", fr: "Sauce Piquante" },
  RANCH: { en: "Ranch", fr: "Ranch" },
  HONEY_MUSTARD: { en: "Honey Mustard", fr: "Miel Moutarde" },
  SWEET_CHILI: { en: "Sweet Chili", fr: "Sweet Chili" },
  GARLIC_AIOLI: { en: "Garlic Aioli", fr: "Aïoli à l'Ail" },
  OTHER: { en: "Other", fr: "Autre" },
};

// Display names for cheese types (matching backend Prisma schema)
const CHEESE_DISPLAY_NAMES: Record<CheeseType, { en: string; fr: string }> = {
  CHEDDAR: { en: "Cheddar", fr: "Cheddar" },
  MOZZARELLA: { en: "Mozzarella", fr: "Mozzarella" },
  PARMESAN: { en: "Parmesan", fr: "Parmesan" },
  BLUE_CHEESE: { en: "Blue Cheese", fr: "Roquefort" },
  GOAT_CHEESE: { en: "Goat Cheese", fr: "Fromage de Chèvre" },
  SWISS: { en: "Swiss", fr: "Suisse" },
  FETA: { en: "Feta", fr: "Feta" },
  CREAM_CHEESE: { en: "Cream Cheese", fr: "Fromage Frais" },
  PROVOLONE: { en: "Provolone", fr: "Provolone" },
  OTHER: { en: "Other", fr: "Autre" },
};

interface CartDrawerProps {
  language: Language;
}

function formatPrice(price: number | string | null | undefined): string {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price || 0));
  return numPrice.toFixed(2);
}

// Calculate item total including extras
function getItemTotal(cartItem: CartItem): number {
  // Ensure price is a number (backend might send as string)
  const itemPrice = typeof cartItem.item.price === 'number' ? cartItem.item.price : parseFloat(String(cartItem.item.price || 0));
  const saucesExtra = cartItem.selectedSauces?.reduce((s, sauce) => s + (sauce.extraCost || 0), 0) || 0;
  const cheesesExtra = cartItem.selectedCheeses?.reduce((s, cheese) => s + (cheese.extraCost || 0), 0) || 0;
  const supplementsExtra = cartItem.selectedSupplements?.reduce((s, supp) => s + (supp.price || 0), 0) || 0;
  return itemPrice + saucesExtra + cheesesExtra + supplementsExtra;
}

export function CartDrawer({ language }: CartDrawerProps) {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    openCheckout,
    currency,
  } = useCart();

  const t = translations[language];

  const getItemName = (item: typeof items[0]["item"]) => {
    const nameMap = { en: item.nameEn, fr: item.nameFr };
    return nameMap[language] || item.nameFr || "";
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[200] bg-background/80 backdrop-blur-md transition-opacity duration-400",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-[201] w-full max-w-md bg-card border-l border-border shadow-2xl transition-transform duration-400 ease-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-border">
          {/* Background accent */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top right, oklch(0.55 0.24 25 / 0.05) 0%, transparent 70%)",
            }}
          />
          
          <div className="relative flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.24 25 / 0.2), oklch(0.55 0.24 25 / 0.1))",
              }}
            >
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl text-foreground tracking-wider uppercase">
                {language === "fr" ? "Votre Panier" : "Your Cart"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {totalItems} {totalItems === 1 ? (language === "fr" ? "article" : "item") : (language === "fr" ? "articles" : "items")}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="relative h-11 w-11 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in-up">
              <div className="relative mb-6">
                <div 
                  className="absolute inset-0 -m-4 rounded-full blur-xl"
                  style={{
                    background: "radial-gradient(ellipse at center, oklch(0.55 0.24 25 / 0.15) 0%, transparent 70%)",
                  }}
                />
                <div className="relative w-20 h-20 rounded-2xl glass-card flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
              </div>
              <p className="font-display text-xl text-foreground tracking-wider uppercase mb-2">
                {language === "fr" ? "Panier vide" : "Empty cart"}
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Ajoutez des articles pour commencer" : "Add items to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((cartItem, index) => (
                <div
                  key={cartItem.cartItemKey}
                  className="flex gap-4 p-4 rounded-xl glass-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  {cartItem.item.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={cartItem.item.image}
                        alt={getItemName(cartItem.item)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground uppercase tracking-wide line-clamp-1">
                      {getItemName(cartItem.item)}
                    </h3>
                    <p className="text-sm text-primary font-semibold mt-1">
                      {formatPrice(getItemTotal(cartItem))} {currency}
                    </p>

                    {/* Selected Sauces */}
                    {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <Droplets className="w-3 h-3 text-primary shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {cartItem.selectedSauces.map((sauce) => (
                            <span 
                              key={sauce.sauceType}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                            >
                              {sauce.customName || SAUCE_DISPLAY_NAMES[sauce.sauceType]?.[language] || sauce.sauceType}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Cheeses */}
                    {cartItem.selectedCheeses && cartItem.selectedCheeses.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <CircleDot className="w-3 h-3 text-amber-500 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {cartItem.selectedCheeses.map((cheese) => (
                            <span 
                              key={cheese.cheeseType}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-medium"
                            >
                              {cheese.customName || CHEESE_DISPLAY_NAMES[cheese.cheeseType]?.[language] || cheese.cheeseType}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Supplements */}
                    {cartItem.selectedSupplements && cartItem.selectedSupplements.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Utensils className="w-3 h-3 text-emerald-500 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {cartItem.selectedSupplements.map((supp) => (
                            <span 
                              key={supp.id}
                              className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-medium"
                            >
                              {supp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.cartItemKey, cartItem.quantity - 1)
                          }
                          className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-foreground">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(cartItem.cartItemKey, cartItem.quantity + 1)
                          }
                          className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => removeItem(cartItem.cartItemKey)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart button */}
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full py-3 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors border border-dashed border-border rounded-xl hover:border-destructive/50"
                >
                  {language === "fr" ? "Vider le panier" : "Clear cart"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer with total and checkout */}
        {items.length > 0 && (
          <div className="relative border-t border-border px-6 py-6">
            {/* Background accent */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at bottom, oklch(0.55 0.24 25 / 0.05) 0%, transparent 70%)",
              }}
            />
            
            {/* Total */}
            <div className="relative flex items-center justify-between mb-5">
              <span className="text-muted-foreground font-semibold">
                {language === "fr" ? "Total" : "Total"}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(totalPrice)}
                </span>
                <span className="text-sm text-muted-foreground">{currency}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Button
              onClick={openCheckout}
              className="relative w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base uppercase tracking-wide rounded-xl overflow-hidden btn-primary group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Flame className="w-5 h-5" />
                {language === "fr" ? "Commander" : "Checkout"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
