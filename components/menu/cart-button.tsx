"use client";

import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useModal } from "@/contexts/modal-context";
import { cn } from "@/lib/utils";
import { type Language } from "@/lib/translations";

interface CartButtonProps {
  className?: string;
  language?: Language;
}

function formatPrice(price: number | string | null | undefined): string {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price || 0));
  return numPrice.toFixed(2);
}

export function CartButton({ className, language = "fr" }: CartButtonProps) {
  const { totalItems, totalPrice, openCart, currency } = useCart();
  const { isModalOpen } = useModal();

  if (totalItems === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none transition-opacity duration-300",
      isModalOpen && "opacity-30"
    )}>
      <div className="container mx-auto max-w-lg">
        <button
          onClick={openCart}
          className={cn(
            "pointer-events-auto w-full flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 animate-fade-in-up",
            "bg-foreground text-background",
            "hover:scale-[1.02] active:scale-[0.98]",
            "shadow-2xl shadow-black/40",
            className
          )}
        >
          {/* Left - Cart info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-background/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1.5">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-background/60 uppercase tracking-wider font-medium">
                {language === "fr" ? "Votre panier" : "Your cart"}
              </span>
              <span className="block font-bold text-base">
                {formatPrice(totalPrice)} {currency}
              </span>
            </div>
          </div>

          {/* Right - CTA */}
          <div className="flex items-center gap-2 bg-background text-foreground font-semibold text-sm px-4 py-2.5 rounded-xl">
            {language === "fr" ? "Voir panier" : "View cart"}
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
