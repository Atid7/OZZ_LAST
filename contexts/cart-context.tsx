"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { MenuItem, SelectedSauce, SelectedCheese, SelectedSupplement } from "@/lib/types";
import { createOrder, type CreateOrderPayload } from "@/lib/api";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSauces?: SelectedSauce[];
  selectedCheeses?: SelectedCheese[];
  selectedSupplements?: SelectedSupplement[];
  // Unique key for cart items with different customizations
  cartItemKey: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  address: string;
  notes: string;
  orderType: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  orderDetails: OrderDetails;
  restaurantSlug: string;
  currency: string;
  addItem: (item: MenuItem, quantity?: number, selectedSauces?: SelectedSauce[], selectedCheeses?: SelectedCheese[], selectedSupplements?: SelectedSupplement[]) => void;
  removeItem: (cartItemKey: string) => void;
  updateQuantity: (cartItemKey: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setOrderDetails: (details: Partial<OrderDetails>) => void;
  setRestaurantSlug: (slug: string) => void;
  setCurrency: (currency: string) => void;
  submitOrder: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_ORDER_DETAILS: OrderDetails = {
  name: "",
  phone: "",
  address: "",
  notes: "",
  orderType: "TAKEAWAY",
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetailsState] = useState<OrderDetails>(DEFAULT_ORDER_DETAILS);
  const [restaurantSlug, setRestaurantSlug] = useState<string>("");
  const [currency, setCurrency] = useState<string>("€");

  // Helper to generate unique cart item key based on item id and selected options
  const generateCartItemKey = useCallback((itemId: string, sauces?: SelectedSauce[], cheeses?: SelectedCheese[], supplements?: SelectedSupplement[]) => {
    const sauceKey = sauces?.map(s => s.sauceType).sort().join('-') || '';
    const cheeseKey = cheeses?.map(c => c.cheeseType).sort().join('-') || '';
    const supplementKey = supplements?.map(s => s.id).sort().join('-') || '';
    return `${itemId}_${sauceKey}_${cheeseKey}_${supplementKey}`;
  }, []);

  const addItem = useCallback((
    item: MenuItem, 
    quantity: number = 1, 
    selectedSauces?: SelectedSauce[], 
    selectedCheeses?: SelectedCheese[],
    selectedSupplements?: SelectedSupplement[]
  ) => {
    const cartItemKey = generateCartItemKey(item.id, selectedSauces, selectedCheeses, selectedSupplements);
    
    setItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.cartItemKey === cartItemKey);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { 
        item, 
        quantity, 
        selectedSauces, 
        selectedCheeses,
        selectedSupplements,
        cartItemKey 
      }];
    });
  }, [generateCartItemKey]);

  const removeItem = useCallback((cartItemKey: string) => {
    setItems((prev) => prev.filter((ci) => ci.cartItemKey !== cartItemKey));
  }, []);

  const updateQuantity = useCallback((cartItemKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((ci) => ci.cartItemKey !== cartItemKey));
      return;
    }
    setItems((prev) =>
      prev.map((ci) =>
        ci.cartItemKey === cartItemKey ? { ...ci, quantity } : ci
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const setOrderDetails = useCallback((details: Partial<OrderDetails>) => {
    setOrderDetailsState((prev) => ({ ...prev, ...details }));
  }, []);

  const submitOrder = useCallback(async (): Promise<boolean> => {
    try {
      if (!restaurantSlug) {
        throw new Error("Restaurant slug is not set");
      }

      // Calculate total price including extras
      const total = items.reduce((sum, ci) => {
        // Ensure price is a number (backend might send as string)
        const itemPrice = typeof ci.item.price === 'number' ? ci.item.price : parseFloat(String(ci.item.price || 0));
        const saucesExtra = ci.selectedSauces?.reduce((s, sauce) => s + (sauce.extraCost || 0), 0) || 0;
        const cheesesExtra = ci.selectedCheeses?.reduce((s, cheese) => s + (cheese.extraCost || 0), 0) || 0;
        const supplementsExtra = ci.selectedSupplements?.reduce((s, supp) => s + (supp.price || 0), 0) || 0;
        return sum + (itemPrice + saucesExtra + cheesesExtra + supplementsExtra) * ci.quantity;
      }, 0);

      // Transform cart data to API payload
      const payload: CreateOrderPayload = {
        customerName: orderDetails.name,
        customerPhone: orderDetails.phone || undefined,
        customerAddress: orderDetails.address || undefined,
        type: orderDetails.orderType,
        subtotal: total,
        tax: 0,
        discount: 0,
        total: total,
        notes: orderDetails.notes || undefined,
        items: items.map((cartItem) => {
          // Build notes string with selected extras
          const extrasNotes: string[] = [];
          if (cartItem.selectedSauces?.length) {
            const sauceNames = cartItem.selectedSauces.map(s => s.customName || s.sauceType).join(', ');
            extrasNotes.push(`Sauces: ${sauceNames}`);
          }
          if (cartItem.selectedCheeses?.length) {
            const cheeseNames = cartItem.selectedCheeses.map(c => c.customName || c.cheeseType).join(', ');
            extrasNotes.push(`Cheese: ${cheeseNames}`);
          }
          if (cartItem.selectedSupplements?.length) {
            const suppNames = cartItem.selectedSupplements.map(s => s.name).join(', ');
            extrasNotes.push(`Supplements: ${suppNames}`);
          }

          // Ensure price is a number (backend might send as string)
          const itemPrice = typeof cartItem.item.price === 'number' ? cartItem.item.price : parseFloat(String(cartItem.item.price || 0));
          const saucesExtra = cartItem.selectedSauces?.reduce((s, sauce) => s + (sauce.extraCost || 0), 0) || 0;
          const cheesesExtra = cartItem.selectedCheeses?.reduce((s, cheese) => s + (cheese.extraCost || 0), 0) || 0;
          const supplementsExtra = cartItem.selectedSupplements?.reduce((s, supp) => s + (supp.price || 0), 0) || 0;

          return {
            menuItemId: cartItem.item.id,
            name: cartItem.item.nameFr || cartItem.item.nameEn || "",
            price: itemPrice + saucesExtra + cheesesExtra + supplementsExtra,
            quantity: cartItem.quantity,
            notes: extrasNotes.length > 0 ? extrasNotes.join(' | ') : undefined,
            // Send selected sauces and cheeses to backend
            selectedSauces: cartItem.selectedSauces?.map(s => ({
              sauceType: s.sauceType,
              customName: s.customName,
            })),
            selectedCheeses: cartItem.selectedCheeses?.map(c => ({
              cheeseType: c.cheeseType,
              customName: c.customName,
            })),
          };
        }),
      };

      // Call the API
      await createOrder(restaurantSlug, payload);

      // Clear cart on success - do NOT close checkout, let the success screen show
      clearCart();
      setOrderDetailsState(DEFAULT_ORDER_DETAILS);
      // Note: We do NOT setIsCheckoutOpen(false) here - the checkout modal will show success state
      return true;
    } catch (error) {
      console.error("Failed to submit order:", error);
      throw error;
    }
  }, [restaurantSlug, orderDetails, items, clearCart]);

  const totalItems = useMemo(
    () => items.reduce((sum, ci) => sum + ci.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, ci) => {
      // Ensure price is a number (backend might send as string)
      const itemPrice = typeof ci.item.price === 'number' ? ci.item.price : parseFloat(String(ci.item.price || 0));
      const saucesExtra = ci.selectedSauces?.reduce((s, sauce) => s + (sauce.extraCost || 0), 0) || 0;
      const cheesesExtra = ci.selectedCheeses?.reduce((s, cheese) => s + (cheese.extraCost || 0), 0) || 0;
      const supplementsExtra = ci.selectedSupplements?.reduce((s, supp) => s + (supp.price || 0), 0) || 0;
      const itemTotal = (itemPrice + saucesExtra + cheesesExtra + supplementsExtra) * ci.quantity;
      return sum + itemTotal;
    }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      isCheckoutOpen,
      orderDetails,
      restaurantSlug,
      currency,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      setOrderDetails,
      setRestaurantSlug,
      setCurrency,
      submitOrder,
    }),
    [
      items,
      totalItems,
      totalPrice,
      isCartOpen,
      isCheckoutOpen,
      orderDetails,
      restaurantSlug,
      currency,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      setOrderDetails,
      submitOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
