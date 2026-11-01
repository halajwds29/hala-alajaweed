'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  Store,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatSAR } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
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
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'حائل',
    district: '',
    address: '',
    deliveryMethod: 'delivery' as 'delivery' | 'pickup',
    orderType: 'retail' as 'retail' | 'wholesale',
    notes: '',
  });

  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate unique idempotency key once per checkout attempt
  useEffect(() => {
    setIdempotencyKey(`idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  // Sync order type if any cart item is wholesale
  useEffect(() => {
    if (items.some((i) => i.isWholesale)) {
      setFormData((prev) => ({ ...prev, orderType: 'wholesale' }));
    }
  }, [items]);

  // Delivery fee calculation based on effective total after coupon
  const deliveryFee = formData.deliveryMethod === 'pickup' ? 0 : finalTotal >= 350 ? 0 : 25;
  const finalGrandTotal = finalTotal + deliveryFee;

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
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-[#4A1D2E]">لا توجد منتجات لإتمام الطلب</h1>
        <p className="text-xs text-[#6E6468]">سلة المشتريات فارغة حالياً.</p>
        <Link
          href="/products"
          className="inline-block px-5 py-2.5 bg-[#682D43] text-white rounded-xl text-xs font-bold"
        >
          تصفح المتجر
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Phone number is the ONLY mandatory field
    const cleanPhone = formData.phone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('يرجى إدخال رقم الجوال (البيان الإجباري الوحيد لتأكيد الطلب والتواصل).');
      return;
    }
    if (!meetsWholesaleRequirements) {
      setErrorMessage('توجد أصناف بسعر الجملة لم تستوفِ الحد الأدنى للكمية.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          orderType: formData.orderType,
          deliveryMethod: formData.deliveryMethod,
          customer: {
            name: formData.name.trim() || 'عميل حلا الأجاويد',
            phone: cleanPhone,
            city: formData.city.trim() || 'حائل',
            district: formData.district.trim() || 'سيتم التحديد عبر التواصل',
            address: formData.address.trim() || 'سيتم التحديد عبر التواصل',
          },
          customerNotes: formData.notes.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            isWholesale: i.isWholesale,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ الطلب، يرجى المحاولة لاحقاً.');
      }

      // Clear cart
      clearCart();

      // Redirect to Order Success Page
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء معالجة الطلب.';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#E7DCD0]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">إتمام الطلب</h1>
        <p className="text-xs text-[#6E6468]">
          أدخل بيانات الشحن والتواصل لتأكيد حجز طلبك وإرسال نسخته مباشرة عبر واتساب
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="font-bold">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Customer Information (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Type Toggle */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#4A1D2E]">نوع الطلب:</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, orderType: 'retail' })}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center ${
                  formData.orderType === 'retail'
                    ? 'bg-[#682D43] text-white border-[#682D43] shadow-xs'
                    : 'bg-[#FAF6F0] text-[#4A1D2E] border-[#E7DCD0]'
                }`}
              >
                طلب قطاعي عادي
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, orderType: 'wholesale' })}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all text-center ${
                  formData.orderType === 'wholesale'
                    ? 'bg-[#682D43] text-white border-[#682D43] shadow-xs'
                    : 'bg-[#FAF6F0] text-[#4A1D2E] border-[#E7DCD0]'
                }`}
              >
                طلب جملة / توريد تجاري
              </button>
            </div>
          </div>

          {/* Delivery Method Toggle */}
          <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-[#4A1D2E]">طريقة الاستلام:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setFormData({ ...formData, deliveryMethod: 'delivery' })}
                className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.deliveryMethod === 'delivery'
                    ? 'border-[#682D43] bg-[#FAF6F0] ring-2 ring-[#682D43]/20'
                    : 'border-[#E7DCD0] bg-white'
                }`}
              >
                <Truck className="w-5 h-5 text-[#682D43] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#4A1D2E]">توصيل وشحن للعنوان</p>
                  <p className="text-[#6E6468] text-[11px] mt-0.5">
                    توصيل لكافة مدن المملكة (مجاناً للطلبات فوق 350 ر.س)
                  </p>
                </div>
              </label>

              <label
                onClick={() => setFormData({ ...formData, deliveryMethod: 'pickup' })}
                className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  formData.deliveryMethod === 'pickup'
                    ? 'border-[#682D43] bg-[#FAF6F0] ring-2 ring-[#682D43]/20'
                    : 'border-[#E7DCD0] bg-white'
                }`}
              >
                <Store className="w-5 h-5 text-[#682D43] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-[#4A1D2E]">استلام من الفرع (مجاناً)</p>
                  <p className="text-[#6E6468] text-[11px] mt-0.5">
                    الفرع الرئيسي — حائل (حي النقرة)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-4">
            <div className="pb-2 border-b border-[#E7DCD0]">
              <h2 className="text-sm font-bold text-[#4A1D2E]">بيانات العميل وعنوان التسليم:</h2>
            </div>

            {/* Phone Number: The ONLY required field */}
            <div className="p-4 rounded-xl bg-[#FAF6F0] border-2 border-[#682D43]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-[#4A1D2E]">
                  رقم الجوال والواتساب <span className="text-rose-600 font-bold">* (إجباري)</span>
                </label>
                <span className="text-[10px] bg-[#682D43] text-white px-2 py-0.5 rounded font-bold">
                  مطلوب للتأكيد
                </span>
              </div>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-sm bg-white font-mono dir-ltr text-right font-bold"
              />
              <span className="text-[10px] text-[#6E6468] block">
                سنتواصل معكم فوراً على هذا الرقم لتأكيد الطلب وتحديد الموعد المناسب لاستلامه
              </span>
            </div>

            {/* Optional Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                  اسم العميل الكريم <span className="text-[#9F6A76] font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="الاسم أو اسم المؤسسة"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                  المدينة <span className="text-[#9F6A76] font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="حائل، الرياض، القصيم، جدة..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                  الحي <span className="text-[#9F6A76] font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: حي النقرة، حي المروج..."
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                  تفاصيل العنوان / الشارع <span className="text-[#9F6A76] font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="الشارع، رقم المبنى، أو أقرب معلم..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                ملاحظات خاصة بالطلب <span className="text-[#9F6A76] font-normal">(اختياري)</span>
              </label>
              <textarea
                rows={2}
                placeholder="أي توصيات خاصة بالضيافة، وقت التوصيل المفضل، أو كرت إهداء..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Order Review & Confirmation (Left) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm sticky top-28 space-y-4">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-3 border-b border-[#E7DCD0]">
              مراجعة الأصناف ({items.length})
            </h2>

            {/* List preview */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center gap-3 p-2 bg-[#FAF6F0] rounded-xl border border-[#E7DCD0]"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-[#4A1D2E] truncate">{item.productName}</p>
                    <p className="text-[10px] text-[#9F6A76]">
                      {item.variantName} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-black text-[#682D43]">
                    {formatSAR(item.calculatedPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-3 border-t border-[#E7DCD0] space-y-2">
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
                        تم تفعيل خصم {appliedCoupon.percent}% (- {formatSAR(couponDiscount)})
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
                    placeholder="أدخل كود الخصم (مثل AJAWEED10)"
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

            {/* Price Calculations */}
            <div className="pt-3 border-t border-[#E7DCD0] space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي الأصلي</span>
                <span className="font-mono">{formatSAR(subtotal)}</span>
              </div>

              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>إجمالي الخصم المطبق</span>
                  <span className="font-mono">- {formatSAR(discountTotal)}</span>
                </div>
              )}

              {appliedCoupon && couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الكود الترويجي ({appliedCoupon.code})</span>
                  <span className="font-mono">- {formatSAR(couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span className="font-mono font-medium text-[#682D43]">
                  {deliveryFee === 0 ? 'مجاناً' : formatSAR(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E7DCD0] flex justify-between items-baseline text-base font-black text-[#4A1D2E]">
                <span>الإجمالي النهائي:</span>
                <span className="text-xl text-[#682D43] font-mono">
                  {formatSAR(finalGrandTotal)}
                </span>
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7DCD0] text-[11px] text-[#6E6468] space-y-1">
              <p className="font-bold text-[#4A1D2E] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                الدفع عند الاستلام أو التحويل البنكي
              </p>
              <p>
                لا يتم خصم أي مبالغ الآن. سيتم تأكيد وسيلة الدفع بالتنسيق المباشر عبر واتساب.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-[#682D43] hover:bg-[#522234] text-white hover:shadow-lg active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الطلب بأمان...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد الطلب وحفظه</span>
                </>
              )}
            </button>

            <div className="text-center pt-1">
              <Link
                href="/cart"
                className="text-[11px] text-[#9F6A76] hover:text-[#682D43] font-medium"
              >
                العودة لتعديل السلة
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

