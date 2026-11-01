'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, AlertCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatSAR } from '@/lib/utils';

export default function CartDrawer() {
  const {
    isOpen,
    setIsOpen,
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountTotal,
    total,
    appliedCoupon,
    couponDiscount,
    finalTotal,
    meetsWholesaleRequirements,
    unmetWholesaleItems,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 md:pl-10">
        <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col border-r border-[#E7DCD0]">
          {/* Header */}
          <div className="p-5 border-b border-[#E7DCD0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#682D43]" />
              <h2 className="text-lg font-bold text-[#4A1D2E]">سلة المشتريات</h2>
              <span className="text-xs bg-[#682D43]/10 text-[#682D43] px-2 py-0.5 rounded-full font-bold">
                {items.length} أصناف
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition-colors"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wholesale Warning if any unmet requirements */}
          {!meetsWholesaleRequirements && (
            <div className="bg-amber-50 border-y border-amber-200 p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">تنبيه طلب الجملة:</p>
                <p>
                  يوجد أصناف بسعر الجملة لم تستوفِ الحد الأدنى للكمية (
                  {unmetWholesaleItems.map((i) => `${i.productName}: أدنى كمية ${i.minWholesaleQty}`).join('، ')}
                  ). يرجى زيادة الكمية لتطبيق سعر الجملة.
                </p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#9F6A76]">
                <div className="w-16 h-16 rounded-full bg-[#682D43]/10 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-[#682D43]" />
                </div>
                <h3 className="font-bold text-base text-[#4A1D2E] mb-1">السلة فارغة حالياً</h3>
                <p className="text-xs max-w-xs mb-4">
                  تصفح تشكيلات حلا الأجاويد الفاخرة من البقلاوة، الكليجا، والشوكولاتة وأضف ما يناسب ضيافتك.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 bg-[#682D43] text-white rounded-xl text-xs font-bold hover:bg-[#522234] transition-colors"
                >
                  استعراض جميع المنتجات
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const isWholesaleWarning =
                  item.isWholesale && item.quantity < item.minWholesaleQty;

                return (
                  <div
                    key={item.variantId}
                    className="p-3 bg-white rounded-xl border border-[#E7DCD0] shadow-2xs flex gap-3 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F7F1E9]">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-[#4A1D2E] truncate">
                            {item.productName}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                            title="حذف من السلة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#F7F1E9] text-[#682D43] font-medium">
                            {item.variantName}
                          </span>
                          {item.isWholesale && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#682D43] font-bold">
                              سعر جملة
                            </span>
                          )}
                        </div>
                        {isWholesaleWarning && (
                          <p className="text-[10px] text-amber-700 font-semibold mt-1">
                            الحد الأدنى للجملة: {item.minWholesaleQty} {item.unitName}
                          </p>
                        )}
                      </div>

                      {/* Pricing and Qty controls */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F7F1E9]">
                        <div className="text-right">
                          <span className="text-xs font-black text-[#682D43]">
                            {formatSAR(item.calculatedPrice * item.quantity)}
                          </span>
                          {item.originalPrice > item.calculatedPrice && (
                            <span className="text-[10px] text-gray-400 line-through mr-1 font-mono">
                              {formatSAR(item.originalPrice * item.quantity)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-[#FAF6F0] rounded-lg p-0.5 border border-[#E7DCD0]">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-colors"
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-600 hover:bg-white hover:text-black transition-colors"
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-[#E7DCD0] bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>المجموع الأصلي</span>
                  <span className="font-mono">{formatSAR(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>مجموع الخصومات والتوفير</span>
                    <span className="font-mono">- {formatSAR(discountTotal)}</span>
                  </div>
                )}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>خصم الكود ({appliedCoupon.code})</span>
                    <span className="font-mono">- {formatSAR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-[#4A1D2E] pt-2 border-t border-[#E7DCD0]">
                  <span>الإجمالي النهائي</span>
                  <span className="text-[#682D43] font-mono">{formatSAR(finalTotal)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#682D43] text-[#682D43] text-xs font-bold text-center hover:bg-[#682D43]/5 transition-colors"
                >
                  معاينة السلة
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#682D43] text-white text-xs font-bold text-center hover:bg-[#522234] transition-colors flex items-center justify-center gap-1 shadow-md"
                >
                  <span>إتمام الطلب</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

