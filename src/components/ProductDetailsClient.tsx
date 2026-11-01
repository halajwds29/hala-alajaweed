'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Minus,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { calculateEffectivePrice, formatSAR } from '@/lib/utils';

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const { addItem } = useCart();

  // Active image selection
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Pricing mode: Retail (قطاعي) vs Wholesale (جملة)
  const [isWholesale, setIsWholesale] = useState(false);

  // Active Variant selection
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );

  // Selected Variant object
  const currentVariant = useMemo(() => {
    return (
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product.variants, selectedVariantId]);

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Check pricing & minimum wholesale quantity
  const priceInfo = useMemo(() => {
    if (!currentVariant) {
      return {
        unitPrice: 0,
        originalPrice: 0,
        discountAmount: 0,
        meetsWholesaleMin: true,
        minWholesaleQty: 1,
      };
    }
    return calculateEffectivePrice(currentVariant, isWholesale, quantity);
  }, [currentVariant, isWholesale, quantity]);

  // Auto-suggest wholesale minimum quantity if user switches to wholesale
  const handleToggleWholesale = (toWholesale: boolean) => {
    setIsWholesale(toWholesale);
    if (toWholesale && currentVariant) {
      const minQty = currentVariant.minWholesaleQty || 1;
      if (quantity < minQty) {
        setQuantity(minQty);
      }
    }
  };

  const lineTotal = priceInfo.unitPrice * quantity;
  const originalLineTotal = priceInfo.originalPrice * quantity;

  // Handle adding to cart
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    if (!currentVariant || !product.isAvailable || !currentVariant.isAvailable) return;
    if (isWholesale && !priceInfo.meetsWholesaleMin) return;

    addItem(product, currentVariant, quantity, isWholesale);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const images = product.images.length > 0
    ? product.images
    : [{ url: '/images/products/baklava-real.jpg', isPrimary: true, sortOrder: 1 }];

  const activeImageUrl = images[selectedImageIndex]?.url || images[0]?.url;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* 1. Left Gallery (Images) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Display Image */}
        <div className="relative w-full pt-[90%] rounded-3xl overflow-hidden bg-white border border-[#E7DCD0] shadow-sm">
          <Image
            key={activeImageUrl}
            src={activeImageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover transition-opacity duration-500 animate-fadeIn"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Badges on image */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-[#682D43] text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                مختارات الضيافة
              </span>
            )}
            {product.calories && (
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#682D43] text-xs font-bold border border-[#EBE3D7] shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                {product.calories} سعرة حرارية ({product.caloriesBasis || 'لكل 100 جرام'})
              </span>
            )}
          </div>
        </div>

        {/* Thumbnails row (supports 4 or more images) */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative pt-[90%] rounded-xl overflow-hidden border-2 transition-all duration-300 active:scale-95 ${
                  selectedImageIndex === idx
                    ? 'border-[#682D43] shadow-md ring-2 ring-[#682D43]/20 scale-105'
                    : 'border-[#EBE3D7] opacity-75 hover:opacity-100 hover:border-[#C99BA4] hover:scale-102'
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${product.name} - صورة ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Guarantees Box */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] grid grid-cols-3 gap-2 text-center text-xs text-[#4A1D2E]">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
            <span className="font-bold">جودة مضمونة</span>
            <span className="text-[10px] text-[#6E6468]">مكونات نقية 100%</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-5 h-5 text-[#C5A059]" />
            <span className="font-bold">توصيل لكافة المدن</span>
            <span className="text-[10px] text-[#6E6468]">تغليف آمن ومحكم</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RotateCcw className="w-5 h-5 text-[#C5A059]" />
            <span className="font-bold">ضمان الطزاجة</span>
            <span className="text-[10px] text-[#6E6468]">صنع يومياً بحائل</span>
          </div>
        </div>
      </div>

      {/* 2. Product Details & Purchase Form */}
      <div className="lg:col-span-6 space-y-6">
        {/* Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-[#9F6A76]">
            {product.categoryName || 'تشكيلات فاخرة'}
          </span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
              product.isAvailable
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {product.isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                متوفر للطلب
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                غير متوفر حالياً
              </>
            )}
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E] leading-snug">
            {product.name}
          </h1>
          {product.nameEn && (
            <p className="text-xs text-[#9F6A76] uppercase tracking-wider font-semibold mt-0.5">
              {product.nameEn}
            </p>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#6E6468] leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Mode Selector: Retail vs Wholesale */}
        <div className="p-3 bg-white rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-2">
          <div className="text-xs font-bold text-[#4A1D2E] mb-1">اختر نوع التسعير:</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleToggleWholesale(false)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                !isWholesale
                  ? 'bg-[#682D43] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#4A1D2E] hover:bg-[#EFE6D8]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>شراء قطاعي (افتراضي)</span>
            </button>

            <button
              type="button"
              onClick={() => handleToggleWholesale(true)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isWholesale
                  ? 'bg-[#682D43] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#4A1D2E] hover:bg-[#EFE6D8]'
              }`}
            >
              <Store className="w-4 h-4 text-[#C5A059]" />
              <span>طلب جملة وتوريد</span>
            </button>
          </div>

          {isWholesale && (
            <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#C5A059]/40 text-[11px] text-[#682D43] space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                أسعار جملة خاصة للمناسبات والمقاهي
              </p>
              <p className="text-[#6E6468]">
                يُشترط طلب الحد الأدنى المحدد لكل خيار بيع لتطبيق سعر الجملة التلقائي.
              </p>
            </div>
          )}
        </div>

        {/* Variants Selection (طرق البيع: قطعة / علبة / وزن / حجم) */}
        {product.variants.length > 0 && (
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#4A1D2E] block">
              اختر خيار وطريقة البيع:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const eff = calculateEffectivePrice(v, isWholesale, isWholesale ? v.minWholesaleQty : 1);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      if (isWholesale && quantity < v.minWholesaleQty) {
                        setQuantity(v.minWholesaleQty);
                      }
                    }}
                    className={`p-3 rounded-xl text-right border transition-all relative ${
                      isSelected
                        ? 'border-[#682D43] bg-white ring-2 ring-[#682D43]/20 shadow-xs'
                        : 'border-[#E7DCD0] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-xs text-[#4A1D2E]">{v.name}</span>
                      <span className="font-mono text-xs font-black text-[#682D43]">
                        {formatSAR(eff.unitPrice)}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#9F6A76] mt-1 flex items-center justify-between">
                      <span>وحدة: {v.unitName}</span>
                      {isWholesale && (
                        <span className="text-[#C5A059] font-bold">
                          أدنى كمية: {v.minWholesaleQty}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Wholesale Minimum Quantity Warning */}
        {isWholesale && !priceInfo.meetsWholesaleMin && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">تنبيه الحد الأدنى لسعر الجملة:</p>
              <p>
                الحد الأدنى لطلب {currentVariant?.name} بسعر الجملة هو{' '}
                <strong>{priceInfo.minWholesaleQty}</strong> {currentVariant?.unitName}. يرجى رفع الكمية.
              </p>
            </div>
          </div>
        )}

        {/* Quantity & Live Price Summary */}
        <div className="p-4 bg-white rounded-2xl border border-[#E7DCD0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A1D2E]">الكمية المطلوبة:</span>
            <div className="flex items-center gap-3 bg-[#FAF6F0] rounded-xl p-1 border border-[#E7DCD0]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-[#682D43] hover:text-white transition-colors"
                aria-label="تقليل الكمية"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-black w-8 text-center font-mono">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-[#682D43] hover:text-white transition-colors"
                aria-label="زيادة الكمية"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-[#F7F1E9] space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>سعر الوحدة ({currentVariant?.unitName})</span>
              <span className="font-mono">{formatSAR(priceInfo.unitPrice)}</span>
            </div>
            {priceInfo.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>الخصم المطبق</span>
                <span className="font-mono">- {formatSAR(priceInfo.discountAmount * quantity)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-[#E7DCD0]">
              <span className="text-sm font-black text-[#4A1D2E]">الإجمالي:</span>
              <div className="text-left">
                <span className="text-xl font-black text-[#682D43] font-mono">
                  {formatSAR(lineTotal)}
                </span>
                {originalLineTotal > lineTotal && (
                  <span className="block text-[10px] text-gray-400 line-through font-mono">
                    {formatSAR(originalLineTotal)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              !product.isAvailable ||
              !currentVariant?.isAvailable ||
              (isWholesale && !priceInfo.meetsWholesaleMin)
            }
            className={`w-full py-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
              !product.isAvailable || !currentVariant?.isAvailable
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isWholesale && !priceInfo.meetsWholesaleMin
                ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-[#682D43] hover:bg-[#522234] text-white hover:shadow-lg'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              {addedAnimation
                ? 'تمت الإضافة للسلة بنجاح ✓'
                : isWholesale && !priceInfo.meetsWholesaleMin
                ? 'الكمية أقل من حد الجملة الأدنى'
                : 'إضافة إلى سلة المشتريات'}
            </span>
          </button>
        </div>

        {/* Detailed Description */}
        {product.description && (
          <div className="pt-4 border-t border-[#E7DCD0] space-y-2">
            <h3 className="text-sm font-bold text-[#4A1D2E]">عن هذا الصنف الفاخر:</h3>
            <div className="text-xs text-[#6E6468] leading-relaxed whitespace-pre-line bg-white/60 p-4 rounded-xl border border-[#E7DCD0]">
              {product.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

