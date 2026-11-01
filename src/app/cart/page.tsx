'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatSAR } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    toggleWholesale,
    clearCart,
    subtotal,
    discountTotal,
    total,
    appliedCoupon,
    couponDiscount,
    finalTotal,
    applyCoupon,
    removeCoupon,
    meetsWholesaleRequirements,
    unmetWholesaleItems,
  } = useCart();

  const [couponInput, setCouponInput] = React.useState('');
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponMessage, setCouponMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponInput);
    setCouponLoading(false);
    if (res.success) {
      setCouponMessage({ text: res.message, type: 'success' });
      setCouponInput('');
    } else {
      setCouponMessage({ text: res.message, type: 'error' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#682D43] border border-[#E7DCD0]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-[#4A1D2E]">سلة المشتريات فارغة</h1>
        <p className="text-xs sm:text-sm text-[#6E6468] max-w-md mx-auto">
          لم تقم بإضافة أي أصناف إلى سلتك حتى الآن. استمتع باكتشاف تشكيلاتنا الفاخرة من البقلاوة
          والكليجا والبوكسات الملكية.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-[#682D43] text-white hover:bg-[#522234] text-xs font-bold transition-colors inline-block"
          >
            تصفح المنتجات الآن
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">
            سلة المشتريات
          </h1>
          <p className="text-xs text-[#6E6468]">
            لديك {items.length} أصناف في السلة
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>إفراغ السلة</span>
        </button>
      </div>

      {/* Wholesale alert */}
      {!meetsWholesaleRequirements && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">تنبيه شروط أسعار الجملة والتوريد:</p>
            <p className="mt-1">
              المنتجات التالية تم اختيارها بسعر الجملة لكن لم تستوفِ الحد الأدنى المطلوب:
            </p>
            <ul className="list-disc list-inside mt-1 font-semibold">
              {unmetWholesaleItems.map((i) => (
                <li key={i.variantId}>
                  {i.productName} ({i.variantName}): الكمية الحالية {i.quantity} / الحد الأدنى {i.minWholesaleQty} {i.unitName}
                </li>
              ))}
            </ul>
            <p className="mt-1 text-[11px]">
              يرجى زيادة الكمية لتطبيق سعر الجملة أو تحويل الصنف للقطاعي لإتمام الطلب.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Cart Items (Left) vs Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items Table / Cards */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const hasWholesaleWarning =
              item.isWholesale && item.quantity < item.minWholesaleQty;

            return (
              <div
                key={item.variantId}
                className="bg-white rounded-2xl border border-[#E7DCD0] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xs"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF6F0] shrink-0 border border-[#E7DCD0]">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#4A1D2E]">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="hover:text-[#682D43]"
                        >
                          {item.productName}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#9F6A76] mt-0.5">
                        خيار البيع: <strong>{item.variantName}</strong> ({item.unitName})
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="حذف الصنف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wholesale Switch */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6E6468]">نوع التسعير:</span>
                      <button
                        type="button"
                        onClick={() => toggleWholesale(item.variantId, !item.isWholesale)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          item.isWholesale
                            ? 'bg-[#C5A059] text-black font-black'
                            : 'bg-[#FAF6F0] text-[#682D43] border border-[#E7DCD0]'
                        }`}
                      >
                        {item.isWholesale ? 'سعر جملة (مُفعل)' : 'سعر قطاعي (تبديل لجملة)'}
                      </button>
                    </div>

                    {item.isWholesale && (
                      <span className="text-[10px] text-[#9F6A76]">
                        الحد الأدنى للجملة: {item.minWholesaleQty} {item.unitName}
                      </span>
                    )}
                  </div>

                  {hasWholesaleWarning && (
                    <p className="text-[11px] font-bold text-rose-700 mt-1">
                      ⚠️ يرجى رفع الكمية إلى {item.minWholesaleQty} على الأقل لاستيفاء سعر الجملة.
                    </p>
                  )}
                </div>

                {/* Quantity and Price */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-[#F7F1E9]">
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-[#FAF6F0] rounded-xl p-1 border border-[#E7DCD0]">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-[#682D43] hover:text-white transition-colors"
                      aria-label="تقليل"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-7 text-center font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-[#682D43] hover:text-white transition-colors"
                      aria-label="زيادة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-left">
                    <span className="text-sm sm:text-base font-black text-[#682D43] font-mono">
                      {formatSAR(item.calculatedPrice * item.quantity)}
                    </span>
                    {item.originalPrice > item.calculatedPrice && (
                      <span className="block text-[10px] text-gray-400 line-through font-mono">
                        {formatSAR(item.originalPrice * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#682D43] hover:text-[#C5A059]"
            >
              <ArrowRight className="w-4 h-4" />
              <span>متابعة التسوق وإضافة أصناف أخرى</span>
            </Link>
          </div>
        </div>

        {/* Order Summary (Right) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm sticky top-28 space-y-4">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-3 border-b border-[#E7DCD0]">
              ملخص الطلب
            </h2>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-[#E7DCD0] space-y-2">
              <label className="block text-xs font-bold text-[#4A1D2E]">
                هل لديك كود خصم؟
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold">{appliedCoupon.code}</span>
                      <span className="text-[11px] block text-emerald-700">
                        خصم {appliedCoupon.percent}% (- {formatSAR(couponDiscount)})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="كود الخصم (مثل AJAWEED10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43] font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#682D43] text-white text-xs font-bold hover:bg-[#522234] disabled:opacity-50 transition-colors"
                  >
                    {couponLoading ? '...' : 'تطبيق'}
                  </button>
                </div>
              )}
              {couponMessage && (
                <p
                  className={`text-[11px] font-medium ${
                    couponMessage.type === 'error' ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي الأصلي</span>
                <span className="font-mono">{formatSAR(subtotal)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>إجمالي الخصومات والتوفير</span>
                  <span className="font-mono">- {formatSAR(discountTotal)}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الكود ({appliedCoupon.code})</span>
                  <span className="font-mono">- {formatSAR(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span className="text-[#682D43] font-medium">
                  يُحسب عند إتمام الطلب (أو استلام من الفرع مجاناً)
                </span>
              </div>

              <div className="pt-3 border-t border-[#E7DCD0] flex justify-between items-baseline text-base font-black text-[#4A1D2E]">
                <span>المجموع الكلي:</span>
                <span className="text-xl text-[#682D43] font-mono">{formatSAR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <Link
                href={meetsWholesaleRequirements ? '/checkout' : '#'}
                onClick={(e) => {
                  if (!meetsWholesaleRequirements) {
                    e.preventDefault();
                    alert('يرجى استيفاء الحد الأدنى للكميات لخيارات الجملة أولاً.');
                  }
                }}
                className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
                  meetsWholesaleRequirements
                    ? 'bg-[#682D43] text-white hover:bg-[#522234] hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>الانتقال لإتمام الطلب</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Badges */}
            <div className="pt-4 border-t border-[#E7DCD0] space-y-2 text-[11px] text-[#6E6468]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>حفظ آمن للطلب وإرسال فوري عبر واتساب</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>توصيل لكافة مدن المملكة أو استلام من فرع حائل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

