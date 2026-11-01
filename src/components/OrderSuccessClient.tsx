'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  Printer,
  Truck,
  ArrowRight,
  MapPin,
  Clock,
  Copy,
  Check,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '@/types';
import { formatSAR, buildWhatsAppOrderMessage, formatDateAr, translateStatus } from '@/lib/utils';

interface OrderSuccessClientProps {
  order?: Order | null;
  initialOrder?: Order | null;
  orderNumber?: string;
}

export default function OrderSuccessClient({
  order: propOrder,
  initialOrder,
  orderNumber: propOrderNumber,
}: OrderSuccessClientProps) {
  const [order, setOrder] = useState<Order | null>(initialOrder || propOrder || null);
  const [loading, setLoading] = useState(!initialOrder && !propOrder);
  const [copiedCode, setCopiedCode] = useState(false);

  const displayOrderNumber = order?.orderNumber || propOrderNumber || '';

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#682D43', '#C5A059', '#C99BA4', '#F7F1E9'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Client-side fetch fallback if SSR missed the order
  useEffect(() => {
    if (!order && displayOrderNumber) {
      fetch(`/api/orders/${displayOrderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch((err) => console.error('Failed to load order:', err))
        .finally(() => setLoading(false));
    }
  }, [order, displayOrderNumber]);

  const handleCopyCode = async () => {
    if (!displayOrderNumber) return;
    try {
      await navigator.clipboard.writeText(displayOrderNumber);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const statusInfo = translateStatus(order?.status || 'new');
  const whatsappUrl = order
    ? buildWhatsAppOrderMessage(order, '+966546002435')
    : `https://wa.me/966546002435?text=${encodeURIComponent(
        `السلام عليكم، أود تأكيد طلبي من حلا الأجاويد برقم: ${displayOrderNumber}`
      )}`;

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-[#682D43] animate-spin mx-auto" />
        <p className="text-sm font-bold text-[#4A1D2E]">جاري تحميل بيانات الطلب...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Banner */}
      <div className="text-center bg-white rounded-3xl border border-[#E7DCD0] p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] text-[#682D43] text-xs font-bold border border-[#EBE3D7] mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>تم تسجيل طلبك بنجاح في نظام حلا الأجاويد</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E] mb-2">
          شكراً لثقتكم واختياركم حلا الأجاويد
        </h1>

        <p className="text-xs sm:text-sm text-[#6E6468] max-w-lg mx-auto">
          تم استلام طلبكم وهو الآن بحالة (
          <span className="font-bold text-[#4A1D2E]">{statusInfo.label}</span>). يُرجى إرسال تفاصيل
          الطلب عبر الواتساب لتأكيد الحجز والتنسيق المباشر مع فريق التجهيز.
        </p>

        {/* Prominent Order Code Box */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#FAF6F0] border-2 border-dashed border-[#682D43]/40 max-w-md mx-auto shadow-inner space-y-3">
          <span className="text-xs font-bold text-[#9F6A76] block">
            كود الطلب المعتمد الخاص بكم (Order Code):
          </span>
          <div className="flex items-center justify-center gap-2.5 sm:gap-3">
            <span className="text-2xl sm:text-3xl font-black text-[#682D43] font-mono tracking-widest bg-white px-4 sm:px-5 py-2 rounded-xl border border-[#EBE3D7] shadow-xs">
              {displayOrderNumber}
            </span>
            <button
              onClick={handleCopyCode}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                copiedCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#682D43] hover:bg-[#522234] text-white active:scale-95'
              }`}
              title="نسخ كود الطلب"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="text-[11px]">تم النسخ ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-[11px]">نسخ الكود</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-[#6E6468]">
            احتفظ بهذا الكود لمتابعة حالة طلبك أو تقديمه عند الاستلام
          </p>
        </div>

        {/* Primary Action: Direct WhatsApp Sending */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-300 hover:scale-102 active:scale-95"
          >
            <MessageCircle className="w-5 h-5" />
            <span>إرسال تفاصيل الطلب عبر واتساب للتأكيد الفوري</span>
          </a>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D7] text-[#4A1D2E] font-bold text-xs border border-[#E7DCD0] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E7DCD0]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#4A1D2E] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
                <span>ملخص أصناف الطلب</span>
              </h2>
              <span className="text-[11px] text-[#6E6468] block mt-0.5">
                تاريخ الطلب: {formatDateAr(order.createdAt)}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.colorClass} ${statusInfo.bgClass}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Customer / Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7] text-xs">
            <div className="space-y-1">
              <span className="font-bold text-[#4A1D2E] block">بيانات العميل والتواصل:</span>
              <p className="text-gray-700">
                {order.customer.name && order.customer.name !== 'عميل حلا الأجاويد'
                  ? `${order.customer.name} • `
                  : ''}
                <strong className="text-[#682D43] font-mono dir-ltr inline-block">
                  {order.customer.phone}
                </strong>
              </p>
              {order.customerNotes && (
                <p className="text-[11px] text-[#682D43] italic mt-1">
                  ملاحظة العميل: «{order.customerNotes}»
                </p>
              )}
            </div>

            <div className="space-y-1 sm:border-r sm:border-[#E7DCD0] sm:pr-4">
              <span className="font-bold text-[#4A1D2E] block">طريقة الاستلام والعنوان:</span>
              <p className="text-gray-700">
                {order.deliveryMethod === 'pickup'
                  ? 'استلام من الفرع'
                  : `توصيل: ${order.customer.city || 'حائل'} ${
                      order.customer.district && order.customer.district !== 'سيتم التحديد عبر التواصل'
                        ? `— ${order.customer.district}`
                        : ''
                    }`}
              </p>
              {order.customer.address && order.customer.address !== 'سيتم التحديد عبر التواصل' && (
                <p className="text-[11px] text-gray-500">{order.customer.address}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-[#E7DCD0] border-y border-[#E7DCD0]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-xs gap-3">
                <div className="flex-1">
                  <h4 className="font-bold text-[#4A1D2E]">{item.productName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                    <span>{item.variantName}</span>
                    <span>•</span>
                    <span>الكمية: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-left font-mono font-bold text-[#4A1D2E]">
                  {formatSAR(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span className="font-mono">{formatSAR(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>إجمالي الخصم المطبق:</span>
                <span className="font-mono">- {formatSAR(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>رسوم التوصيل:</span>
              <span className="font-mono">
                {order.deliveryFee === 0 ? 'مجاناً' : formatSAR(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-[#E7DCD0] text-base font-black text-[#4A1D2E]">
              <span>الإجمالي المستحق:</span>
              <span className="text-xl text-[#682D43] font-mono">{formatSAR(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex items-center justify-between text-xs no-print">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#682D43] hover:text-[#C5A059] font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
        <Link
          href="/track-order"
          className="inline-flex items-center gap-1.5 text-[#682D43] hover:text-[#C5A059] font-bold"
        >
          <Truck className="w-4 h-4" />
          <span>متابعة حالة الطلب لاحقاً</span>
        </Link>
      </div>
    </div>
  );
}
