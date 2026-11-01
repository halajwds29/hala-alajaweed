'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  Filter,
  ShoppingBag,
  Printer,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatSAR, formatDateAr, translateStatus, buildWhatsAppOrderMessage } from '@/lib/utils';

interface AdminOrdersListClientProps {
  initialOrders: Order[];
}

export default function AdminOrdersListClient({ initialOrders }: AdminOrdersListClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesNum = o.orderNumber.toLowerCase().includes(q);
      const matchesName = o.customer.name.toLowerCase().includes(q);
      const matchesPhone = o.customer.phone.includes(q);
      if (!matchesNum && !matchesName && !matchesPhone) return false;
    }
    return true;
  });

  const handleStatusChange = async (orderNumber: string, newStatus: OrderStatus) => {
    setUpdatingOrder(orderNumber);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, status: newStatus }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.orderNumber === orderNumber ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error || 'فشل تحديث الحالة');
      }
    } catch {
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setUpdatingOrder(null);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إدارة ومتابعة طلبات المتجر</h1>
          <p className="text-xs text-[#6E6468]">
            إجمالي الطلبات ({orders.length}) — يمكنك تصفية الطلبات، تغيير حالتها، أو طباعة الفواتير
          </p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7DCD0] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="ابحث برقم الطلب، اسم العميل، أو رقم الجوال..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-60 px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none font-medium"
        >
          <option value="all">كافة الحالات ({orders.length})</option>
          {statuses.map((st) => (
            <option key={st.key} value={st.key}>
              {st.label} ({orders.filter((o) => o.status === st.key).length})
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-b border-[#E7DCD0]">
              <tr>
                <th className="py-3 px-4 font-bold">رقم الطلب</th>
                <th className="py-3 px-4 font-bold">العميل والجوال</th>
                <th className="py-3 px-4 font-bold">المدينة والتسليم</th>
                <th className="py-3 px-4 font-bold">النوع والأصناف</th>
                <th className="py-3 px-4 font-bold">الإجمالي</th>
                <th className="py-3 px-4 font-bold">تغيير الحالة</th>
                <th className="py-3 px-4 font-bold">التاريخ</th>
                <th className="py-3 px-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F1E9]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    لا توجد طلبات مطابقة للفلتر المحدد.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = translateStatus(order.status);
                  const isBusy = updatingOrder === order.orderNumber;
                  const waUrl = buildWhatsAppOrderMessage(order, '+966546002435');

                  return (
                    <tr key={order._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#682D43]">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#4A1D2E] block">{order.customer.name}</span>
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="text-[11px] text-gray-500 font-mono dir-ltr block text-right hover:text-[#682D43]"
                        >
                          {order.customer.phone}
                        </a>
                      </td>

                      {/* City & Method */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#4A1D2E] font-medium block">
                          {order.customer.city} ({order.customer.district})
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {order.deliveryMethod === 'pickup' ? 'استلام فرع' : 'توصيل عنوان'}
                        </span>
                      </td>

                      {/* Type & Items count */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-0.5 ${
                            order.orderType === 'wholesale'
                              ? 'bg-[#C5A059]/20 text-[#682D43]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.orderType === 'wholesale' ? 'جملة' : 'قطاعي'}
                        </span>
                        <span className="block text-[11px] text-gray-600">
                          {order.items.length} أصناف
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-mono font-black text-[#682D43]">
                        {formatSAR(order.total)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={isBusy}
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.orderNumber, e.target.value as OrderStatus)
                          }
                          className={`text-xs px-2.5 py-1 rounded-full border font-bold focus:outline-none cursor-pointer ${
                            statusInfo.bgClass
                          } ${statusInfo.colorClass}`}
                        >
                          {statuses.map((st) => (
                            <option key={st.key} value={st.key}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-500 text-[11px] whitespace-nowrap">
                        {formatDateAr(order.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/orders/${order.orderNumber}`}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] transition-colors"
                            title="تفاصيل الطلب الكاملة"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#25D366] transition-colors"
                            title="فتح بالواتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

