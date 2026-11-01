'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  Calendar,
  Phone,
  MessageCircle,
  ArrowRight,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Order } from '@/types';
import { formatSAR, formatDateAr, translateStatus, buildWhatsAppOrderMessage } from '@/lib/utils';

export default function TrackOrderPage() {
  const [phone, setPhone] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setOrders([]);

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 8) {
      setError('يرجى إدخال رقم جوال صحيح (8 أرقام على الأقل) للمتابعة.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          orderNumber: orderNumber.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'لم يتم العثور على أي طلب مسجل بهذا الرقم.');
      }

      setOrder(data.order);
      setOrders(data.orders || [data.order]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء البحث عن الطلب.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const steps = [
    { key: 'new', label: 'تم استلام الطلب' },
    { key: 'reviewing', label: 'قيد المراجعة والتدقيق' },
    { key: 'confirmed', label: 'تم التأكيد' },
    { key: 'preparing', label: 'قيد التجهيز والخَبز' },
    { key: 'ready', label: 'جاهز للتسليم' },
    { key: 'delivering', label: 'قيد التوصيل للشحن' },
    { key: 'completed', label: 'تم التسليم بنجاح' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const statusOrder = [
      'new',
      'reviewing',
      'confirmed',
      'preparing',
      'ready',
      'delivering',
      'completed',
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto mb-3">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">
          متابعة حالة الطلب
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6468] max-w-md mx-auto">
          أدخل رقم الجوال المسجل بالطلب للاستعلام الفوري ومتابعة مراحل التجهيز والتوصيل.
        </p>
      </div>

      {/* Lookup Form: Phone Number ONLY required */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number: The ONLY required input */}
            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                رقم الجوال المسجل في الطلب <span className="text-rose-600 font-bold">* (مطلوب)</span>
              </label>
              <input
                type="tel"
                required
                placeholder="05XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-sm font-mono text-center dir-ltr bg-[#FAF6F0] font-bold"
              />
              <span className="text-[10px] text-[#8C7D82] mt-1 block">
                يكفي إدخال رقم الجوال فقط للاستعلام عن طلباتكم
              </span>
            </div>

            {/* Order Number: Completely Optional */}
            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                رقم الطلب <span className="text-[#9F6A76] font-normal">(اختياري)</span>
              </label>
              <input
                type="text"
                placeholder="مثال: HA-XXXXXX-XXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-sm font-mono text-center uppercase bg-[#FAF6F0]"
              />
              <span className="text-[10px] text-[#8C7D82] mt-1 block">
                اتركه فارغاً لعرض أحدث طلب لك تلقائياً
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {loading ? (
                <span>جاري الاستعلام عن الطلب...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>استعلام عن حالة الطلب</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Multiple Orders Selector (if more than 1 order found for this phone) */}
      {orders.length > 1 && (
        <div className="bg-[#FAF6F0] rounded-2xl border border-[#E7DCD0] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#4A1D2E] font-bold">
            <span>تم العثور على {orders.length} طلبات مسجلة برقم الجوال:</span>
            <span className="text-[11px] text-[#8C7D82]">اضغط على أي طلب لعرض تفاصيله</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {orders.map((o) => {
              const isSelected = order?.orderNumber === o.orderNumber;
              const status = translateStatus(o.status);
              return (
                <button
                  key={o.orderNumber}
                  type="button"
                  onClick={() => setOrder(o)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#682D43] text-white border-[#682D43] shadow-xs'
                      : 'bg-white text-[#4A1D2E] border-[#E7DCD0] hover:border-[#682D43]'
                  }`}
                >
                  <span className="font-mono">{o.orderNumber}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : status.bgClass + ' ' + status.colorClass
                    }`}
                  >
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-8 animate-fadeIn">
          {/* Order Header Summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E7DCD0]">
            <div>
              <span className="text-[11px] text-[#9F6A76] block mb-0.5">كود الطلب المعتمد:</span>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-mono font-black text-[#682D43]">
                  {order.orderNumber}
                </h2>
                <button
                  onClick={() => handleCopyCode(order.orderNumber)}
                  className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EBE3D7] text-[#682D43] transition-colors"
                  title="نسخ كود الطلب"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-[#6E6468] mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{formatDateAr(order.createdAt)}</span>
              </p>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-[#9F6A76] block mb-0.5">حالة الطلب الحالية:</span>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-black border ${
                  translateStatus(order.status).bgClass
                } ${translateStatus(order.status).colorClass}`}
              >
                {translateStatus(order.status).label}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {order.status === 'cancelled' ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-center space-y-1">
              <p className="font-bold text-sm">تم إلغاء هذا الطلب</p>
              <p className="text-[11px]">
                إذا كان لديكم أي استفسار حول سبب الإلغاء يرجى التواصل مباشرة عبر واتساب المتجر.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#4A1D2E]">مراحل تجهيز وتسليم الطلب:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {steps.map((st, i) => {
                  const state = getStepStatus(st.key, order.status);
                  return (
                    <div
                      key={st.key}
                      className={`p-3 rounded-xl border text-center text-xs flex flex-col justify-between transition-all ${
                        state === 'completed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : state === 'current'
                          ? 'bg-[#682D43] border-[#682D43] text-white shadow-md font-bold'
                          : 'bg-[#FAF6F0] border-[#E7DCD0] text-gray-400'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center text-[10px] font-black border">
                        {state === 'completed' ? '✓' : i + 1}
                      </div>
                      <span className="text-[11px] leading-tight">{st.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF6F0] p-4 rounded-2xl border border-[#E7DCD0]">
            <div>
              <span className="text-[#9F6A76] block mb-0.5">بيانات العميل:</span>
              <span className="font-bold text-[#4A1D2E] block">
                {order.customer.name && order.customer.name !== 'عميل حلا الأجاويد'
                  ? order.customer.name
                  : 'عميل حلا الأجاويد'}
              </span>
              <span className="font-mono text-gray-600 dir-ltr inline-block mt-0.5">
                {order.customer.phone}
              </span>
            </div>
            <div>
              <span className="text-[#9F6A76] block mb-0.5">طريقة الاستلام والمدينة:</span>
              <span className="font-bold text-[#4A1D2E] block">
                {order.deliveryMethod === 'pickup' ? 'استلام من الفرع الرئيسي' : 'توصيل وشحن'}
              </span>
              <span className="text-gray-600 block mt-0.5">
                {order.customer.city || 'حائل'}
                {order.customer.district && order.customer.district !== 'سيتم التحديد عبر التواصل'
                  ? ` — ${order.customer.district}`
                  : ''}
              </span>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#E7DCD0]">
              <span className="text-[#9F6A76] block mb-1">المنتجات المطلوبة ({order.items.length}):</span>
              <ul className="space-y-1.5">
                {order.items.map((i, idx) => (
                  <li key={idx} className="flex justify-between border-b border-[#E7DCD0]/60 pb-1">
                    <span>
                      {i.productName} ({i.variantName}) × {i.quantity}
                    </span>
                    <span className="font-mono font-bold text-[#682D43]">
                      {formatSAR(i.totalPrice)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-between font-black text-sm text-[#4A1D2E]">
              <span>إجمالي الطلب:</span>
              <span className="text-[#682D43] font-mono text-base">{formatSAR(order.total)}</span>
            </div>
          </div>

          {/* Action on this order */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E7DCD0]">
            <div className="flex items-center gap-2">
              <a
                href={buildWhatsAppOrderMessage(order, '+966546002435')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة المؤسسة عبر واتساب حول هذا الطلب</span>
              </a>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#EBE3D7] text-[#4A1D2E] text-xs font-bold transition-colors flex items-center gap-1.5 border border-[#E7DCD0]"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة</span>
              </button>
            </div>

            <Link
              href="/"
              className="text-xs font-bold text-[#682D43] hover:text-[#C5A059] flex items-center gap-1"
            >
              <span>العودة للمتجر</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
