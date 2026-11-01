'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Printer,
  MessageCircle,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatSAR, formatDateAr, translateStatus, buildWhatsAppOrderMessage } from '@/lib/utils';

interface AdminOrderDetailsClientProps {
  initialOrder: Order;
}

export default function AdminOrderDetailsClient({ initialOrder }: AdminOrderDetailsClientProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const statuses: { key: OrderStatus; label: string }[] = [
    { key: 'new', label: 'جديد' },
    { key: 'reviewing', label: 'قيد المراجعة' },
    { key: 'confirmed', label: 'مؤكد' },
    { key: 'preparing', label: 'قيد التجهيز' },
    { key: 'ready', label: 'جاهز للتسليم' },
    { key: 'delivering', label: 'قيد التوصيل' },
    { key: 'completed', label: 'مكتمل' },
    { key: 'cancelled', label: 'ملغي' },
  ];

  const handleUpdate = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          status,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل الحفظ');
      }

      setOrder(data.order);
      setStatus(data.order.status);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في التحديث';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const statusInfo = translateStatus(order.status);
  const waUrl = buildWhatsAppOrderMessage(order, '+966546002435');

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 print:py-0 print:space-y-0 print:max-w-full print:px-0 print:pb-0">
      {/* Top Header (Screen only - HIDDEN IN PRINT) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0] no-print print:hidden">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-[#9F6A76] hover:text-[#682D43] flex items-center gap-1 mb-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لقائمة الطلبات</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#4A1D2E]">
              طلب رقم: {order.orderNumber}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#E7DCD0] bg-white text-xs font-bold hover:bg-[#FAF6F0] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#682D43]" />
            <span>طباعة الفاتورة</span>
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>مراسلة العميل بالطلب</span>
          </a>
        </div>
      </div>

      {/* Admin Status & Notes Controls (Screen only - HIDDEN IN PRINT) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4 no-print print:hidden">
        <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
          إدارة حالة الطلب وملاحظات الإدارة
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              تغيير حالة الطلب:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-bold focus:outline-none"
            >
              {statuses.map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              ملاحظات الإدارة الداخلية (لا تظهر للعميل):
            </label>
            <input
              type="text"
              placeholder="مثال: تم التنسيق مع العميل، الدفع كاش عند التسليم..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>تم تحديث حالة الطلب وملاحظات الإدارة بنجاح ✓</span>
          </div>
        )}

        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>تحديث حالة الطلب</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Document (Print-ready single-page container) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 shadow-sm space-y-6 printable-invoice-container print:space-y-3 print:p-4 print:border-[1.5px] print:border-[#4A1D2E]">
        {/* Invoice Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-[#4A1D2E] print:pb-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="شعار مؤسسة حلا الأجاويد للحلويات"
              className="w-16 h-14 object-contain"
            />
            <div>
              <span className="text-lg font-black text-[#4A1D2E] block leading-tight">مؤسسة حلا الأجاويد للحلويات</span>
              <p className="text-xs text-[#9F6A76] font-bold">فاتورة طلب رسمية — HALA ALAJAWEED</p>
              <p className="text-[10px] text-gray-500 mt-0.5">المقر: حائل — حي النقرة | هاتف: 0541430116 | واتساب: 0546002435</p>
            </div>
          </div>
          <div className="text-left font-mono">
            <span className="inline-block px-2.5 py-0.5 rounded bg-[#682D43] text-white text-[10px] font-black mb-1">
              فاتورة رسمية
            </span>
            <span className="text-xs font-black text-[#4A1D2E] block dir-ltr">كود الطلب: {order.orderNumber}</span>
            <span className="text-[10px] text-gray-500 block">{formatDateAr(order.createdAt)}</span>
            <span className="text-[10px] font-bold text-[#682D43] block">
              الحالة: {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF6F0] p-4 rounded-2xl border border-[#E7DCD0] print:p-2.5 print:rounded-lg print:border-gray-300 print:text-[10px] print:grid-cols-2 print:gap-2">
          <div>
            <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">اسم العميل:</span>
            <span className="font-bold text-[#4A1D2E] text-sm print:text-xs">{order.customer.name}</span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">رقم الجوال:</span>
            <span className="font-bold text-[#4A1D2E] font-mono dir-ltr text-right">
              {order.customer.phone}
            </span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">المدينة والحي:</span>
            <span className="font-bold text-[#4A1D2E]">
              {order.customer.city} — {order.customer.district}
            </span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">نوع الطلب والاستلام:</span>
            <span className="font-bold text-[#4A1D2E]">
              {order.orderType === 'wholesale' ? 'طلب جملة / توريد' : 'طلب قطاعي'} |{' '}
              {order.deliveryMethod === 'pickup' ? 'استلام من الفرع' : 'شحن للعنوان'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">العنوان التفصيلي:</span>
            <span className="font-medium text-[#4A1D2E]">{order.customer.address}</span>
          </div>
          {order.customerNotes && (
            <div className="sm:col-span-2 pt-1 border-t border-[#E7DCD0] print:pt-1">
              <span className="text-[#9F6A76] block mb-0.5 print:text-gray-500">ملاحظات العميل:</span>
              <span className="text-gray-700 italic">{order.customerNotes}</span>
            </div>
          )}
        </div>

        {/* Order Items Table */}
        <div className="border border-[#E7DCD0] rounded-2xl overflow-hidden print:border-gray-300 print:rounded-lg">
          <table className="w-full text-right text-xs printable-invoice-table">
            <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-b border-[#E7DCD0] print:bg-gray-100 print:border-gray-300">
              <tr>
                <th className="py-2.5 px-3 font-bold">#</th>
                <th className="py-2.5 px-3 font-bold">الصنف</th>
                <th className="py-2.5 px-3 font-bold">خيار البيع</th>
                <th className="py-2.5 px-3 font-bold text-center">الكمية</th>
                <th className="py-2.5 px-3 font-bold font-mono">سعر الوحدة</th>
                <th className="py-2.5 px-3 font-bold font-mono text-left">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DCD0]/60 print:divide-gray-200">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAF6F0]/50">
                  <td className="py-2 px-3 text-gray-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-[#4A1D2E]">
                    {item.productName}
                  </td>
                  <td className="py-2 px-3 text-[#9F6A76] text-[11px] print:text-gray-700">
                    {item.variantName} ({item.unitName})
                  </td>
                  <td className="py-2 px-3 font-mono font-bold text-center">{item.quantity}</td>
                  <td className="py-2 px-3 font-mono text-gray-600 text-[11px]">
                    {formatSAR(item.unitPrice)}
                  </td>
                  <td className="py-2 px-3 font-mono font-black text-[#682D43] text-left">
                    {formatSAR(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="pt-2 border-t border-[#E7DCD0] flex justify-end print:pt-1">
          <div className="w-full sm:w-64 space-y-1.5 text-xs print:w-60 print:text-[10px] print:space-y-1">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span className="font-mono font-bold">{formatSAR(order.subtotal)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>إجمالي الخصم:</span>
                <span className="font-mono">- {formatSAR(order.discountTotal)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>رسوم التوصيل:</span>
              <span className="font-mono">{order.deliveryFee === 0 ? 'مجاناً' : formatSAR(order.deliveryFee)}</span>
            </div>
            <div className="pt-2 border-t-2 border-[#4A1D2E] flex justify-between items-baseline font-black text-sm text-[#4A1D2E] print:pt-1">
              <span>الإجمالي المستحق:</span>
              <span className="text-base text-[#682D43] font-mono print:text-sm">{formatSAR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Print-Only Footer Note */}
        <div className="hidden print:block text-center pt-2.5 border-t border-gray-300 text-[9px] text-gray-500">
          شكراً لتعاملكم مع حلا الأجاويد • فخر الضيافة السعودية الأصيلة • هاتف وواتساب: 0541430116 / 0546002435
        </div>
      </div>
    </div>
  );
}

