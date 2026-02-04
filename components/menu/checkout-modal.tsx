"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Phone,
  User,
  FileText,
  Store,
  Truck,
  Check,
  ArrowLeft,
  Loader2,
  PartyPopper,
  Flame,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/cart-context";
import { Language } from "@/lib/translations";
import { SauceType, CheeseType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast"
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

interface CheckoutModalProps {
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
  return itemPrice + saucesExtra + cheesesExtra;
}

export function CheckoutModal({ language }: CheckoutModalProps) {
  const {
    items,
    totalPrice,
    isCheckoutOpen,
    closeCheckout,
    openCart,
    orderDetails,
    setOrderDetails,
    submitOrder,
    currency,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset order success state when checkout modal opens (for reorders)
  useEffect(() => {
    if (isCheckoutOpen) {
      setOrderSuccess(false);
      setErrors({});
    }
  }, [isCheckoutOpen]);

  const getItemName = (item: typeof items[0]["item"]) => {
    const nameMap = { en: item.nameEn, fr: item.nameFr };
    return nameMap[language] || item.nameFr || "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!orderDetails.name.trim()) {
      newErrors.name = language === "fr" ? "Nom requis" : "Name required";
    }
    if (!orderDetails.phone.trim()) {
      newErrors.phone = language === "fr" ? "Telephone requis" : "Phone required";
    } else if (!/^[0-9+\s-]{8,}$/.test(orderDetails.phone)) {
      newErrors.phone = language === "fr" ? "Numero invalide" : "Invalid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const success = await submitOrder();
      if (success) {
        setOrderSuccess(true);
        toast.success("Merci pour votre commande ! ")
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Une erreur est survenue";
      if (errorMessage.includes("already exists") || errorMessage.includes("duplicate")) {
        toast.error(
          language === "fr"
            ? "Erreur technique. Veuillez réessayer dans quelques secondes."
            : "Technical error. Please try again in a few seconds."
        );
      } else {
        toast.error(
          language === "fr"
            ? "Échec de la commande. Veuillez réessayer."
            : "Order failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderSuccess(false);
    closeCheckout();
  };

  const handleBackToCart = () => {
    closeCheckout();
    openCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[300] bg-background/90 backdrop-blur-lg transition-opacity duration-400",
          isCheckoutOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[90vh] z-[301] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-400 flex flex-col",
          isCheckoutOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {orderSuccess ? (
          /* Success State */
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[450px] animate-scale-in">
            {/* Background glow */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, oklch(0.6 0.18 160 / 0.1) 0%, transparent 70%)",
              }}
            />
            
            <div className="relative mb-8">
              <div 
                className="absolute inset-0 -m-6 rounded-full blur-2xl"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.6 0.18 160 / 0.3) 0%, transparent 70%)",
                }}
              />
              <div className="relative w-24 h-24 rounded-2xl badge-emerald flex items-center justify-center">
                <PartyPopper className="w-12 h-12" />
              </div>
            </div>
            <h2 className="font-display text-3xl text-foreground tracking-wider uppercase mb-3">
              {language === "fr" ? "Commande confirmee !" : "Order Confirmed!"}
            </h2>
            <p className="text-muted-foreground mb-10 max-w-sm leading-relaxed">
              {language === "fr"
                ? "Votre commande a ete recue. Nous vous contacterons bientot."
                : "Your order has been received. We'll contact you shortly."}
            </p>
            <Button
              onClick={handleClose}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-4 rounded-xl btn-primary"
            >
              {language === "fr" ? "Retour au menu" : "Back to Menu"}
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
              {/* Background accent */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top, oklch(0.55 0.24 25 / 0.05) 0%, transparent 70%)",
                }}
              />
              
              <div className="relative flex items-center gap-3">
                <button
                  onClick={handleBackToCart}
                  className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="font-display text-xl text-foreground tracking-wider uppercase">
                    {language === "fr" ? "Finaliser" : "Checkout"}
                  </h2>
                  <p className="text-xs text-primary font-semibold">
                    {formatPrice(totalPrice)} {currency}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-11 w-11 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
              {/* Order Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                  {language === "fr" ? "Type de commande" : "Order Type"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "DINE_IN", icon: UtensilsCrossed, labelFr: "Sur place", labelEn: "Dine In" },
                    { type: "TAKEAWAY", icon: Store, labelFr: "A emporter", labelEn: "Takeaway" },
                  ].map(({ type, icon: Icon, labelFr, labelEn }) => (
                    <button
                      key={type}
                      onClick={() => setOrderDetails({ orderType: type as any })}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 font-bold text-[10px] uppercase tracking-wide transition-all duration-300",
                        orderDetails.orderType === type
                          ? "border-primary bg-primary/10 text-primary shadow-lg"
                          : "border-border bg-secondary/30 text-muted-foreground hover:border-border hover:bg-secondary/60"
                      )}
                      style={{
                        boxShadow: orderDetails.orderType === type 
                          ? "0 4px 20px -4px oklch(0.55 0.24 25 / 0.3)" 
                          : "none"
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {language === "fr" ? labelFr : labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {language === "fr" ? "Votre nom" : "Your Name"} *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={orderDetails.name}
                    onChange={(e) => setOrderDetails({ name: e.target.value })}
                    placeholder={language === "fr" ? "Jean Dupont" : "John Doe"}
                    className={cn(
                      "w-full input-premium py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50",
                      errors.name && "border-destructive focus:border-destructive"
                    )}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-destructive mt-2 font-medium">{errors.name}</p>
                )}
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {language === "fr" ? "Telephone" : "Phone"} *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({ phone: e.target.value })}
                    placeholder="09 51 34 24 63"
                    className={cn(
                      "w-full input-premium py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50",
                      errors.phone && "border-destructive focus:border-destructive"
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-destructive mt-2 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  {language === "fr" ? "Notes (optionnel)" : "Notes (optional)"}
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                  <textarea
                    value={orderDetails.notes}
                    onChange={(e) => setOrderDetails({ notes: e.target.value })}
                    placeholder={language === "fr" ? "Instructions speciales..." : "Special instructions..."}
                    rows={2}
                    className="w-full input-premium py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-5 border-t border-border">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  {language === "fr" ? "Resume de la commande" : "Order Summary"}
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {items.map((cartItem) => (
                    <div
                      key={cartItem.cartItemKey}
                      className="text-sm py-2 border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          <span className="text-foreground font-medium">{cartItem.quantity}x</span> {getItemName(cartItem.item)}
                        </span>
                        <span className="text-foreground font-semibold">
                          {formatPrice(getItemTotal(cartItem) * cartItem.quantity)} {currency}
                        </span>
                      </div>
                      {/* Selected extras */}
                      {((cartItem.selectedSauces?.length ?? 0) > 0 || (cartItem.selectedCheeses?.length ?? 0) > 0) && (
                        <div className="mt-1.5 pl-6 text-xs text-muted-foreground">
                          {cartItem.selectedSauces && cartItem.selectedSauces.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-primary">Sauces:</span>
                              {cartItem.selectedSauces.map((s, i) => (
                                <span key={s.sauceType}>
                                  {s.customName || SAUCE_DISPLAY_NAMES[s.sauceType]?.[language] || s.sauceType}
                                  {i < cartItem.selectedSauces!.length - 1 ? ',' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                          {cartItem.selectedCheeses && cartItem.selectedCheeses.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-amber-500">Fromage:</span>
                              {cartItem.selectedCheeses.map((c, i) => (
                                <span key={c.cheeseType}>
                                  {c.customName || CHEESE_DISPLAY_NAMES[c.cheeseType]?.[language] || c.cheeseType}
                                  {i < cartItem.selectedCheeses!.length - 1 ? ',' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative border-t border-border px-6 py-5 shrink-0">
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
                  {language === "fr" ? "Total a payer" : "Total to pay"}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">{currency}</span>
                </div>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="relative w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base uppercase tracking-wide rounded-xl overflow-hidden btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === "fr" ? "Envoi..." : "Sending..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    {language === "fr" ? "Confirmer la commande" : "Confirm Order"}
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
