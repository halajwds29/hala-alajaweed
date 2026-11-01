'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { calculateEffectivePrice } from '@/lib/utils';

export interface AppliedCoupon {
  code: string;
  percent: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity?: number,
    isWholesale?: boolean
  ) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleWholesale: (variantId: string, isWholesale: boolean) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  appliedCoupon: AppliedCoupon | null;
  couponDiscount: number;
  finalTotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discountPercent?: number }>;
  removeCoupon: () => void;
  hasWholesaleItems: boolean;
  meetsWholesaleRequirements: boolean;
  unmetWholesaleItems: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'hala_alajaweed_cart_v1';
const COUPON_STORAGE_KEY = 'hala_alajaweed_coupon_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and coupon from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart/coupon from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart and coupon to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save cart/coupon to storage', e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addItem = (
    product: Product,
    variant: ProductVariant,
    quantity = 1,
    isWholesale = false
  ) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variantId === variant.id);
      const primaryImage =
        product.images.find((img) => img.isPrimary)?.url ||
        product.images[0]?.url ||
        '/placeholder-sweet.jpg';

      const initialQty = existingIndex !== -1 ? prevItems[existingIndex].quantity + quantity : quantity;
      const wholesaleActive = isWholesale && variant.isWholesaleAvailable;

      const priceData = calculateEffectivePrice(variant, wholesaleActive, initialQty);

      if (existingIndex !== -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: initialQty,
          isWholesale: wholesaleActive,
          calculatedPrice: priceData.unitPrice,
          originalPrice: priceData.originalPrice,
        };
        return updated;
      }

      const newItem: CartItem = {
        productId: product._id,
        productName: product.name,
        productSlug: product.slug,
        categorySlug: product.categorySlug,
        image: primaryImage,
        variantId: variant.id,
        variantName: variant.name,
        saleMethod: variant.saleMethod,
        unitName: variant.unitName,
        quantity: initialQty,
        isWholesale: wholesaleActive,
        retailPrice: variant.retailPrice,
        retailDiscount: variant.retailDiscount,
        retailDiscountType: variant.retailDiscountType,
        wholesalePrice: variant.wholesalePrice,
        wholesaleDiscount: variant.wholesaleDiscount,
        wholesaleDiscountType: variant.wholesaleDiscountType,
        minWholesaleQty: variant.minWholesaleQty || 1,
        calculatedPrice: priceData.unitPrice,
        originalPrice: priceData.originalPrice,
      };

      return [...prevItems, newItem];
    });

    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const fakeVariant: ProductVariant = {
            id: item.variantId,
            name: item.variantName,
            saleMethod: item.saleMethod,
            unitValue: 1,
            unitName: item.unitName,
            retailPrice: item.retailPrice,
            retailDiscount: item.retailDiscount,
            retailDiscountType: item.retailDiscountType,
            wholesalePrice: item.wholesalePrice,
            wholesaleDiscount: item.wholesaleDiscount,
            wholesaleDiscountType: item.wholesaleDiscountType,
            minWholesaleQty: item.minWholesaleQty,
            isWholesaleAvailable: true,
            isAvailable: true,
            sortOrder: 0,
          };
          const priceData = calculateEffectivePrice(fakeVariant, item.isWholesale, quantity);
          return {
            ...item,
            quantity,
            calculatedPrice: priceData.unitPrice,
            originalPrice: priceData.originalPrice,
          };
        }
        return item;
      })
    );
  };

  const toggleWholesale = (variantId: string, isWholesale: boolean) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const fakeVariant: ProductVariant = {
            id: item.variantId,
            name: item.variantName,
            saleMethod: item.saleMethod,
            unitValue: 1,
            unitName: item.unitName,
            retailPrice: item.retailPrice,
            retailDiscount: item.retailDiscount,
            retailDiscountType: item.retailDiscountType,
            wholesalePrice: item.wholesalePrice,
            wholesaleDiscount: item.wholesaleDiscount,
            wholesaleDiscountType: item.wholesaleDiscountType,
            minWholesaleQty: item.minWholesaleQty,
            isWholesaleAvailable: true,
            isAvailable: true,
            sortOrder: 0,
          };
          // If toggled to wholesale and quantity is less than minimum, auto-adjust or flag
          const newQty = isWholesale && item.quantity < item.minWholesaleQty ? item.minWholesaleQty : item.quantity;
          const priceData = calculateEffectivePrice(fakeVariant, isWholesale, newQty);
          return {
            ...item,
            isWholesale,
            quantity: newQty,
            calculatedPrice: priceData.unitPrice,
            originalPrice: priceData.originalPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const { subtotal, discountTotal, total } = useMemo(() => {
    let sub = 0;
    let disc = 0;

    items.forEach((item) => {
      const regularLineTotal = item.originalPrice * item.quantity;
      const effectiveLineTotal = item.calculatedPrice * item.quantity;
      sub += regularLineTotal;
      disc += Math.max(0, regularLineTotal - effectiveLineTotal);
    });

    return {
      subtotal: Number(sub.toFixed(2)),
      discountTotal: Number(disc.toFixed(2)),
      total: Number(Math.max(0, sub - disc).toFixed(2)),
    };
  }, [items]);

  const hasWholesaleItems = useMemo(() => {
    return items.some((item) => item.isWholesale);
  }, [items]);

  const unmetWholesaleItems = useMemo(() => {
    return items.filter((item) => item.isWholesale && item.quantity < item.minWholesaleQty);
  }, [items]);

  const meetsWholesaleRequirements = unmetWholesaleItems.length === 0;

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { success: false, message: 'يرجى كتابة كود الخصم' };
    }

    try {
      const res = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          percent: data.discountPercent,
        });
        return {
          success: true,
          message: data.message || `تم تطبيق خصم ${data.discountPercent}% بنجاح!`,
          discountPercent: data.discountPercent,
        };
      } else {
        return { success: false, message: data.message || 'كود الخصم غير صالح' };
      }
    } catch {
      // Fallback local validation for offline / smooth experience
      if (trimmed === 'AJAWEED10') {
        setAppliedCoupon({ code: 'AJAWEED10', percent: 10 });
        return { success: true, message: 'تم تطبيق خصم 10% بنجاح!', discountPercent: 10 };
      }
      return { success: false, message: 'تعذر التحقق من كود الخصم حالياً' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || total <= 0) return 0;
    const disc = (total * appliedCoupon.percent) / 100;
    return Number(disc.toFixed(2));
  }, [appliedCoupon, total]);

  const finalTotal = useMemo(() => {
    return Number(Math.max(0, total - couponDiscount).toFixed(2));
  }, [total, couponDiscount]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        toggleWholesale,
        clearCart,
        totalItemsCount,
        subtotal,
        discountTotal,
        total,
        appliedCoupon,
        couponDiscount,
        finalTotal,
        applyCoupon,
        removeCoupon,
        hasWholesaleItems,
        meetsWholesaleRequirements,
        unmetWholesaleItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

