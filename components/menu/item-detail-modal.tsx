"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, Check, Flame, Leaf, Star, Award, Droplets, CircleDot } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type Language } from "@/lib/translations";
import { MenuItem, MenuItemSauce, MenuItemCheese, SelectedSauce, SelectedCheese, SauceType, CheeseType } from "@/lib/types";
import { useCart } from "@/contexts/cart-context";
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

interface ItemDetailModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

function formatPrice(price: number | string | null | undefined): string {
  const numPrice = typeof price === "number" ? price : parseFloat(String(price || 0));
  return numPrice.toFixed(2);
}

export function ItemDetailModal({ item, isOpen, onClose, language }: ItemDetailModalProps) {
  const { addItem, currency } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);
  const [selectedSauceTypes, setSelectedSauceTypes] = useState<Set<SauceType>>(new Set());
  const [selectedCheeseTypes, setSelectedCheeseTypes] = useState<Set<CheeseType>>(new Set());
  const [sauceError, setSauceError] = useState<string | null>(null);

  // Reset state when modal opens with a new item
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setShowAdded(false);
      setSelectedSauceTypes(new Set());
      setSelectedCheeseTypes(new Set());
      setSauceError(null);
    }
  }, [isOpen, item?.id]);

  // Sauce validation constants
  const MIN_SAUCES = 1;
  const MAX_SAUCES = 3;

  // Group sauces and cheeses by included/extra
  const { includedSauces, extraSauces, includedCheeses, extraCheeses } = useMemo(() => {
    if (!item) return { includedSauces: [], extraSauces: [], includedCheeses: [], extraCheeses: [] };
    
    const includedSauces = item.sauces?.filter(s => s.isIncluded) || [];
    const extraSauces = item.sauces?.filter(s => !s.isIncluded) || [];
    const includedCheeses = item.cheeses?.filter(c => c.isIncluded) || [];
    const extraCheeses = item.cheeses?.filter(c => !c.isIncluded) || [];
    
    return { includedSauces, extraSauces, includedCheeses, extraCheeses };
  }, [item]);

  // Check if item has sauces or cheeses that require selection
  const hasModifierOptions = useMemo(() => {
    return (item?.sauces?.length ?? 0) > 0 || (item?.cheeses?.length ?? 0) > 0;
  }, [item]);

  // Combined count of sauces + cheeses
  const totalModifiersSelected = selectedSauceTypes.size + selectedCheeseTypes.size;

  // Modifier validation (sauces + cheeses combined)
  const modifierValidation = useMemo(() => {
    if (!hasModifierOptions) {
      return { isValid: true, error: null };
    }
    
    const selectedCount = selectedSauceTypes.size + selectedCheeseTypes.size;
    
    if (selectedCount < MIN_SAUCES) {
      return { 
        isValid: false, 
        error: language === "fr" 
          ? `Veuillez choisir au moins ${MIN_SAUCES} sauce ou fromage` 
          : `Please select at least ${MIN_SAUCES} sauce or cheese` 
      };
    }
    
    if (selectedCount > MAX_SAUCES) {
      return { 
        isValid: false, 
        error: language === "fr" 
          ? `Maximum ${MAX_SAUCES} sauces/fromages autorises` 
          : `Maximum ${MAX_SAUCES} sauces/cheeses allowed` 
      };
    }
    
    return { isValid: true, error: null };
  }, [hasModifierOptions, selectedSauceTypes.size, selectedCheeseTypes.size, language]);

  // Calculate extras cost
  const extrasTotal = useMemo(() => {
    if (!item) return 0;
    
    let total = 0;
    selectedSauceTypes.forEach(sauceType => {
      const sauce = item.sauces?.find(s => s.sauceType === sauceType);
      if (sauce && !sauce.isIncluded) {
        total += sauce.extraCost || 0;
      }
    });
    selectedCheeseTypes.forEach(cheeseType => {
      const cheese = item.cheeses?.find(c => c.cheeseType === cheeseType);
      if (cheese && !cheese.isIncluded) {
        total += cheese.extraCost || 0;
      }
    });
    return total;
  }, [item, selectedSauceTypes, selectedCheeseTypes]);

  if (!item) return null;

  const name = language === "fr" ? item.nameFr : item.nameEn;
  const description = language === "fr" ? item.descriptionFr : item.descriptionEn;

  // Toggle sauce selection with combined max limit (sauces + cheeses)
  const toggleSauce = (sauceType: SauceType) => {
    setSauceError(null); // Clear error when user interacts
    setSelectedSauceTypes(prev => {
      const next = new Set(prev);
      if (next.has(sauceType)) {
        next.delete(sauceType);
      } else {
        // Check combined max limit before adding (sauces + cheeses)
        const currentTotal = prev.size + selectedCheeseTypes.size;
        if (currentTotal >= MAX_SAUCES) {
          setSauceError(
            language === "fr" 
              ? `Maximum ${MAX_SAUCES} sauces/fromages autorises` 
              : `Maximum ${MAX_SAUCES} sauces/cheeses allowed`
          );
          return prev; // Don't add if at max
        }
        next.add(sauceType);
      }
      return next;
    });
  };

  // Toggle cheese selection with combined max limit (sauces + cheeses)
  const toggleCheese = (cheeseType: CheeseType) => {
    setSauceError(null); // Clear error when user interacts
    setSelectedCheeseTypes(prev => {
      const next = new Set(prev);
      if (next.has(cheeseType)) {
        next.delete(cheeseType);
      } else {
        // Check combined max limit before adding (sauces + cheeses)
        const currentTotal = selectedSauceTypes.size + prev.size;
        if (currentTotal >= MAX_SAUCES) {
          setSauceError(
            language === "fr" 
              ? `Maximum ${MAX_SAUCES} sauces/fromages autorises` 
              : `Maximum ${MAX_SAUCES} sauces/cheeses allowed`
          );
          return prev; // Don't add if at max
        }
        next.add(cheeseType);
      }
      return next;
    });
  };

  // Get sauce display name
  const getSauceName = (sauce: MenuItemSauce) => {
    if (sauce.customName) return sauce.customName;
    return SAUCE_DISPLAY_NAMES[sauce.sauceType]?.[language] || sauce.sauceType;
  };

  // Get cheese display name
  const getCheeseName = (cheese: MenuItemCheese) => {
    if (cheese.customName) return cheese.customName;
    return CHEESE_DISPLAY_NAMES[cheese.cheeseType]?.[language] || cheese.cheeseType;
  };

  const handleAddToCart = () => {
    // Validate modifier selection if item has sauce/cheese options
    if (hasModifierOptions && !modifierValidation.isValid) {
      setSauceError(modifierValidation.error);
      return;
    }

    // Build selected sauces array
    const selectedSauces: SelectedSauce[] = Array.from(selectedSauceTypes).map(sauceType => {
      const sauce = item.sauces?.find(s => s.sauceType === sauceType);
      return {
        sauceType,
        customName: sauce?.customName,
        extraCost: sauce?.isIncluded ? 0 : (sauce?.extraCost || 0),
      };
    });

    // Build selected cheeses array
    const selectedCheeses: SelectedCheese[] = Array.from(selectedCheeseTypes).map(cheeseType => {
      const cheese = item.cheeses?.find(c => c.cheeseType === cheeseType);
      return {
        cheeseType,
        customName: cheese?.customName,
        extraCost: cheese?.isIncluded ? 0 : (cheese?.extraCost || 0),
      };
    });

    addItem(item, quantity, selectedSauces.length > 0 ? selectedSauces : undefined, selectedCheeses.length > 0 ? selectedCheeses : undefined);
    setSauceError(null);
    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      setQuantity(1);
      setSelectedSauceTypes(new Set());
      setSelectedCheeseTypes(new Set());
      onClose();
    }, 800);
  };

  // Ensure price is a number (backend might send as string)
  const itemPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price || 0));
  const totalPrice = (itemPrice + extrasTotal) * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-lg p-0 overflow-hidden bg-card border-border/50 gap-0"
        showCloseButton={false}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] bg-secondary">
          {item.image ? (
            <Image
              src={item.image}
              alt={name || ""}
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.isChefRecommendation && (
              <div className="flex items-center gap-1.5 bg-amber-500 text-amber-950 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-full shadow-md">
                <Award className="w-3 h-3" />
                Chef
              </div>
            )}
            {item.isPopular && (
              <div className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold tracking-wide uppercase px-2.5 py-1.5 rounded-full shadow-md">
                <Star className="w-3 h-3 fill-current" />
                Popular
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 pb-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <DialogTitle className="font-bold text-xl text-foreground leading-tight">
              {name}
            </DialogTitle>
            <div className="shrink-0 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{formatPrice(itemPrice)}</span>
              <span className="text-sm text-muted-foreground">{currency}</span>
            </div>
          </div>

          {/* Tags */}
          {(item.isSpicy || item.isVegetarian) && (
            <div className="flex items-center gap-3 mb-4">
              {item.isSpicy && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Flame className="w-3.5 h-3.5" />
                  {language === "fr" ? "Piquant" : "Spicy"}
                </span>
              )}
              {item.isVegetarian && (
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Leaf className="w-3.5 h-3.5" />
                  {language === "fr" ? "Végétarien" : "Vegetarian"}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {description}
            </p>
          )}

          {/* Sauces Section */}
          {item.sauces && item.sauces.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                    {language === "fr" ? "Sauces" : "Sauces"}
                  </h4>
                  <span className="text-xs text-destructive font-medium">*</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {totalModifiersSelected}/{MAX_SAUCES} {language === "fr" ? "total" : "total"}
                </span>
              </div>
              
              {/* Combined modifier requirement hint */}
              <p className="text-xs text-muted-foreground mb-3">
                {language === "fr" 
                  ? `Choisissez entre ${MIN_SAUCES} et ${MAX_SAUCES} sauces/fromages au total` 
                  : `Select between ${MIN_SAUCES} and ${MAX_SAUCES} sauces/cheeses total`}
              </p>

              {/* Sauce validation error */}
              {sauceError && (
                <div className="mb-4 p-2.5 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-xs text-destructive font-medium">{sauceError}</p>
                </div>
              )}
              
              {/* Included Sauces */}
              {includedSauces.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === "fr" ? "Incluses" : "Included"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {includedSauces.map((sauce) => (
                      <button
                        key={sauce.sauceType}
                        onClick={() => toggleSauce(sauce.sauceType)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                          "border hover:shadow-md",
                          selectedSauceTypes.has(sauce.sauceType)
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                            : "bg-secondary/50 text-foreground border-border/50 hover:border-primary/50"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {selectedSauceTypes.has(sauce.sauceType) && <Check className="w-3 h-3" />}
                          {getSauceName(sauce)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Sauces */}
              {extraSauces.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === "fr" ? "Extras" : "Extras"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extraSauces.map((sauce) => (
                      <button
                        key={sauce.sauceType}
                        onClick={() => toggleSauce(sauce.sauceType)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                          "border hover:shadow-md",
                          selectedSauceTypes.has(sauce.sauceType)
                            ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                            : "bg-secondary/50 text-foreground border-border/50 hover:border-primary/50"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {selectedSauceTypes.has(sauce.sauceType) && <Check className="w-3 h-3" />}
                          {getSauceName(sauce)}
                          {(sauce.extraCost ?? 0) > 0 && (
                            <span className="text-primary font-semibold">
                              +{formatPrice(sauce.extraCost)} {currency}
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cheeses Section */}
          {item.cheeses && item.cheeses.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <CircleDot className="w-4 h-4 text-amber-500" />
                <h4 className="font-semibold text-sm text-foreground uppercase tracking-wide">
                  {language === "fr" ? "Fromages" : "Cheese"}
                </h4>
              </div>
              
              {/* Included Cheeses */}
              {includedCheeses.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === "fr" ? "Inclus" : "Included"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {includedCheeses.map((cheese) => (
                      <button
                        key={cheese.cheeseType}
                        onClick={() => toggleCheese(cheese.cheeseType)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                          "border hover:shadow-md",
                          selectedCheeseTypes.has(cheese.cheeseType)
                            ? "bg-amber-500 text-amber-950 border-amber-500 shadow-md shadow-amber-500/20"
                            : "bg-secondary/50 text-foreground border-border/50 hover:border-amber-500/50"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {selectedCheeseTypes.has(cheese.cheeseType) && <Check className="w-3 h-3" />}
                          {getCheeseName(cheese)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Cheeses */}
              {extraCheeses.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === "fr" ? "Extras" : "Extras"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {extraCheeses.map((cheese) => (
                      <button
                        key={cheese.cheeseType}
                        onClick={() => toggleCheese(cheese.cheeseType)}
                        className={cn(
                          "px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                          "border hover:shadow-md",
                          selectedCheeseTypes.has(cheese.cheeseType)
                            ? "bg-amber-500 text-amber-950 border-amber-500 shadow-md shadow-amber-500/20"
                            : "bg-secondary/50 text-foreground border-border/50 hover:border-amber-500/50"
                        )}
                      >
                        <span className="flex items-center gap-1.5">
                          {selectedCheeseTypes.has(cheese.cheeseType) && <Check className="w-3 h-3" />}
                          {getCheeseName(cheese)}
                          {(cheese.extraCost ?? 0) > 0 && (
                            <span className="text-amber-600 font-semibold">
                              +{formatPrice(cheese.extraCost)} {currency}
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border/50 my-5" />

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-1 bg-secondary rounded-xl p-1.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-lg text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={hasModifierOptions && !modifierValidation.isValid}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all duration-300",
                showAdded
                  ? "bg-emerald-500 text-white"
                  : hasModifierOptions && !modifierValidation.isValid
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg hover:shadow-primary/25"
              )}
            >
              {showAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  {language === "fr" ? "Ajouté au panier" : "Added to cart"}
                </>
              ) : hasModifierOptions && !modifierValidation.isValid ? (
                <>
                  {language === "fr" ? "Choisissez vos options" : "Select your options"}
                </>
              ) : (
                <>
                  {language === "fr" ? "Ajouter" : "Add"} • {formatPrice(totalPrice)} {currency}
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
