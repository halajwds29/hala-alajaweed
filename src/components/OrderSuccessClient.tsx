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
    <div className="max-w-3xl mx-auto space-y-8 print:py-0 print:space-y-0 print:max-w-full print:px-0">
      {/* Success Banner (Screen only - HIDDEN IN PRINT) */}
      <div className="text-center bg-white rounded-3xl border border-[#E7DCD0] p-8 sm:p-10 shadow-sm relative overflow-hidden no-print print:hidden">
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
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-[#EBE3D7] text-[#4A1D2E] font-bold text-xs border border-[#E7DCD0] transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الفاتورة</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown Card / Printable Invoice */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6 printable-invoice-container print:space-y-3 print:p-4 print:border-[1.5px] print:border-[#4A1D2E]">
          {/* Print-Only Official Header */}
          <div className="hidden print:flex items-center justify-between pb-3 border-b-2 border-[#4A1D2E]">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="شعار مؤسسة حلا الأجاويد للحلويات"
                className="w-16 h-14 object-contain"
              />
              <div>
                <h1 className="text-base font-black text-[#4A1D2E] leading-tight">
                  مؤسسة حلا الأجاويد للحلويات
                </h1>
                <p className="text-[10px] font-bold text-[#9F6A76]">
                  فخر الضيافة السعودية الأصيلة — سجل تجاري معتمد
                </p>
                <p className="text-[9px] text-gray-600">
                  المقر الرئيسي: حائل — حي النقرة | هاتف: 0541430116 | واتساب: 0546002435
                </p>
              </div>
            </div>
            <div className="text-left font-mono">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#682D43] text-white text-[10px] font-black mb-1">
                فاتورة طلب رسمية
              </span>
              <p className="text-xs font-black text-[#4A1D2E] dir-ltr">{order.orderNumber}</p>
              <p className="text-[9px] text-gray-500">{formatDateAr(order.createdAt)}</p>
              <p className="text-[9px] font-bold text-[#682D43]">
                الحالة: {statusInfo.label}
              </p>
            </div>
          </div>

          {/* Screen Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E7DCD0] print:hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7] text-xs print:p-2.5 print:rounded-lg print:border-gray-300 print:text-[10px] print:grid-cols-2 print:gap-2">
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
                <p className="text-[11px] text-[#682D43] italic mt-1 print:text-[10px]">
                  ملاحظة العميل: «{order.customerNotes}»
                </p>
              )}
            </div>

            <div className="space-y-1 sm:border-r sm:border-[#E7DCD0] sm:pr-4 print:border-r print:border-gray-300 print:pr-3">
              <span className="font-bold text-[#4A1D2E] block">طريقة الاستلام والعنوان:</span>
              <p className="text-gray-700">
                {order.deliveryMethod === 'pickup'
                  ? 'استلام من الفرع الرئيسي'
                  : `توصيل وشحن: ${order.customer.city || 'حائل'} ${
                      order.customer.district && order.customer.district !== 'سيتم التحديد عبر التواصل'
                        ? `— ${order.customer.district}`
                        : ''
                    }`}
              </p>
              {order.customer.address && order.customer.address !== 'سيتم التحديد عبر التواصل' && (
                <p className="text-[11px] text-gray-500 print:text-[9px]">{order.customer.address}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-[#E7DCD0] rounded-2xl overflow-hidden print:border-gray-300 print:rounded-lg">
            <table className="w-full text-right text-xs printable-invoice-table">
              <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-b border-[#E7DCD0] print:bg-gray-100 print:border-gray-300">
                <tr>
                  <th className="py-2.5 px-3 font-bold">#</th>
                  <th className="py-2.5 px-3 font-bold">الصنف المطلوب</th>
                  <th className="py-2.5 px-3 font-bold">الخيار</th>
                  <th className="py-2.5 px-3 font-bold text-center">الكمية</th>
                  <th className="py-2.5 px-3 font-bold font-mono">سعر الوحدة</th>
                  <th className="py-2.5 px-3 font-bold font-mono text-left">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7DCD0]/60 print:divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF6F0]/50">
                    <td className="py-2 px-3 text-gray-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-[#4A1D2E]">{item.productName}</td>
                    <td className="py-2 px-3 text-[#9F6A76] text-[11px] print:text-gray-700">{item.variantName}</td>
                    <td className="py-2 px-3 font-mono font-bold text-center">{item.quantity}</td>
                    <td className="py-2 px-3 font-mono text-gray-700 text-[11px]">{formatSAR(item.unitPrice)}</td>
                    <td className="py-2 px-3 font-mono font-black text-[#682D43] text-left">{formatSAR(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals */}
          <div className="flex justify-end pt-1">
            <div className="w-full sm:w-64 space-y-1.5 text-xs print:w-60 print:text-[10px] print:space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>المجموع الفرعي:</span>
                <span className="font-mono font-bold">{formatSAR(order.subtotal)}</span>
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
              <div className="flex justify-between items-baseline pt-2 border-t-2 border-[#4A1D2E] text-base font-black text-[#4A1D2E] print:pt-1">
                <span>الإجمالي المستحق:</span>
                <span className="text-lg text-[#682D43] font-mono print:text-sm">{formatSAR(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Print-Only Footer Note */}
          <div className="hidden print:block text-center pt-2.5 border-t border-gray-300 text-[9px] text-gray-500">
            شكراً لتعاملكم مع حلا الأجاويد • فخر الضيافة السعودية الأصيلة • هاتف وواتساب: 0541430116 / 0546002435
          </div>
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex items-center justify-between text-xs no-print print:hidden">
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
