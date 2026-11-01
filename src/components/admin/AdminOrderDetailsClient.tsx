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
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0] no-print">
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
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#E7DCD0] bg-white text-xs font-bold hover:bg-[#FAF6F0] flex items-center gap-1.5 transition-colors"
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

      {/* Admin Status & Notes Controls */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4 no-print">
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

      {/* Invoice Document (Print-ready) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 shadow-sm space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E7DCD0]">
          <div>
            <span className="text-xl font-black text-[#682D43]">مؤسسة حلا الأجاويد للحلويات</span>
            <p className="text-xs text-[#9F6A76]">فاتورة طلب إلكتروني — HALA ALAJAWEED</p>
            <p className="text-[11px] text-gray-500 mt-1">المقر: حائل — حي النقرة | هاتف: +966546002435</p>
          </div>
          <div className="text-left font-mono">
            <span className="text-sm font-bold text-[#4A1D2E] block">رقم الفاتورة: {order.orderNumber}</span>
            <span className="text-xs text-gray-500">{formatDateAr(order.createdAt)}</span>
          </div>
        </div>

        {/* Customer Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF6F0] p-4 rounded-2xl border border-[#E7DCD0]">
          <div>
            <span className="text-[#9F6A76] block mb-0.5">اسم العميل:</span>
            <span className="font-bold text-[#4A1D2E] text-sm">{order.customer.name}</span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5">رقم الجوال:</span>
            <span className="font-bold text-[#4A1D2E] font-mono dir-ltr text-right">
              {order.customer.phone}
            </span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5">المدينة والحي:</span>
            <span className="font-bold text-[#4A1D2E]">
              {order.customer.city} — {order.customer.district}
            </span>
          </div>
          <div>
            <span className="text-[#9F6A76] block mb-0.5">نوع الطلب والاستلام:</span>
            <span className="font-bold text-[#4A1D2E]">
              {order.orderType === 'wholesale' ? 'طلب جملة / توريد' : 'طلب قطاعي'} |{' '}
              {order.deliveryMethod === 'pickup' ? 'استلام من الفرع' : 'شحن للعنوان'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-[#9F6A76] block mb-0.5">العنوان التفصيلي:</span>
            <span className="font-medium text-[#4A1D2E]">{order.customer.address}</span>
          </div>
          {order.customerNotes && (
            <div className="sm:col-span-2 pt-2 border-t border-[#E7DCD0]">
              <span className="text-[#9F6A76] block mb-0.5">ملاحظات العميل:</span>
              <span className="text-gray-700 italic">{order.customerNotes}</span>
            </div>
          )}
        </div>

        {/* Order Items Table */}
        <div>
          <h3 className="text-xs font-bold text-[#4A1D2E] mb-3">الأصناف والمنتجات:</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-y border-[#E7DCD0]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">الصنف</th>
                  <th className="py-2.5 px-3">خيار البيع</th>
                  <th className="py-2.5 px-3">الكمية</th>
                  <th className="py-2.5 px-3 font-mono">سعر الوحدة</th>
                  <th className="py-2.5 px-3 font-mono">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E9]">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-[#4A1D2E]">
                      {item.productName}
                    </td>
                    <td className="py-3 px-3 text-[#9F6A76]">
                      {item.variantName} ({item.unitName})
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 font-mono text-gray-600">
                      {formatSAR(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-[#682D43]">
                      {formatSAR(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="pt-4 border-t border-[#E7DCD0] flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span className="font-mono">{formatSAR(order.subtotal)}</span>
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
            <div className="pt-2 border-t border-[#E7DCD0] flex justify-between items-baseline font-black text-sm text-[#4A1D2E]">
              <span>الإجمالي المستحق:</span>
              <span className="text-lg text-[#682D43] font-mono">{formatSAR(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

