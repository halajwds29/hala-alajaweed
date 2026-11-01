import React from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowUpLeft,
  Eye,
  Database,
  Cloud,
  AlertTriangle,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/data-service';
import { checkDatabaseConnection } from '@/lib/mongodb';
import { checkCloudinaryConnection } from '@/lib/cloudinary';
import { formatSAR, formatDateAr, translateStatus } from '@/lib/utils';

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboardPage() {
  const [stats, dbStatus, cloudStatus] = await Promise.all([
    getDashboardStats(),
    checkDatabaseConnection(),
    checkCloudinaryConnection(),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-[#4A1D2E]">لوحة المؤشرات والإحصائيات</h1>
        <p className="text-xs text-[#6E6468] mt-1">
          نظرة عامة على أداء المتجر، حالة الطلبات الحديثة، واتصال قواعد البيانات والتخزين السحابي.
        </p>
      </div>

      {/* Database & Cloudinary Status Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* MongoDB Status */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            dbStatus.connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                dbStatus.connected ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs">حالة اتصال MongoDB Atlas:</h3>
              <p className="text-[11px] opacity-80">
                {dbStatus.connected
                  ? `متصل بقاعدة البيانات (${dbStatus.databaseName || 'Atlas'})`
                  : dbStatus.error || 'غير متصل (يعمل المتجر بذاكرة تخزين مؤقتة)'}
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border shadow-2xs hover:bg-black/5"
          >
            فحص
          </Link>
        </div>

        {/* Cloudinary Status */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
            cloudStatus.connected
              ? 'bg-blue-50 border-blue-200 text-blue-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                cloudStatus.connected ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs">تخزين الصور السحابي Cloudinary:</h3>
              <p className="text-[11px] opacity-80">
                {cloudStatus.connected
                  ? `متصل بالحساب السحابي (${cloudStatus.cloudName})`
                  : cloudStatus.error || 'بيانات الاعتماد غير مكتملة (يتم الرفع مؤقتاً)'}
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border shadow-2xs hover:bg-black/5"
          >
            إعداد
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-[#9F6A76]">
            <span className="text-xs font-bold">إجمالي المنتجات</span>
            <Package className="w-4 h-4 text-[#682D43]" />
          </div>
          <div className="text-2xl font-black text-[#4A1D2E] font-mono">
            {stats.totalProducts}
          </div>
          <Link
            href="/admin/products"
            className="text-[11px] text-[#682D43] font-bold hover:underline block"
          >
            إدارة المنتجات والأصناف ←
          </Link>
        </div>

        {/* New Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-bold">طلبات جديدة</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-900 font-mono">
            {stats.newOrders}
          </div>
          <Link
            href="/admin/orders?status=new"
            className="text-[11px] text-amber-800 font-bold hover:underline block"
          >
            مراجعة الطلبات الجديدة ←
          </Link>
        </div>

        {/* Reviewing Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold">قيد المراجعة والتجهيز</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-900 font-mono">
            {stats.reviewingOrders}
          </div>
          <Link
            href="/admin/orders"
            className="text-[11px] text-blue-800 font-bold hover:underline block"
          >
            متابعة التجهيز ←
          </Link>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold">الطلبات المكتملة</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-900 font-mono">
            {stats.completedOrders}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium block">
            تم تسليمها للعميل بنجاح
          </span>
        </div>

        {/* Total Registered Orders Value */}
        <div className="bg-[#4A1D2E] text-white p-5 rounded-2xl shadow-md space-y-3 border border-[#C5A059]/40">
          <div className="flex items-center justify-between text-[#C99BA4]">
            <span className="text-xs font-bold">قيمة الطلبات المسجلة</span>
            <DollarSign className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div className="text-xl font-black text-[#C5A059] font-mono">
            {formatSAR(stats.totalOrdersValue)}
          </div>
          <p className="text-[10px] text-[#F7F1E9]/70 leading-tight">
            * إجمالي قيمة الطلبات المسجلة بالنظام ، وليس الإيرادات المحصلة
          </p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E]">أحدث الطلبات المسجلة</h2>
            <p className="text-xs text-[#9F6A76]">آخر الطلبات الواردة من المتجر الإلكتروني</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#682D43] hover:text-[#C5A059] flex items-center gap-1"
          >
            <span>عرض كل الطلبات</span>
            <ArrowUpLeft className="w-4 h-4" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            لا توجد أي طلبات مسجلة حتى الآن.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-y border-[#E7DCD0]">
                <tr>
                  <th className="py-3 px-4 font-bold">رقم الطلب</th>
                  <th className="py-3 px-4 font-bold">العميل</th>
                  <th className="py-3 px-4 font-bold">المدينة</th>
                  <th className="py-3 px-4 font-bold">نوع الطلب</th>
                  <th className="py-3 px-4 font-bold">الأصناف</th>
                  <th className="py-3 px-4 font-bold">الإجمالي</th>
                  <th className="py-3 px-4 font-bold">الحالة</th>
                  <th className="py-3 px-4 font-bold">التاريخ</th>
                  <th className="py-3 px-4 font-bold">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F1E9]">
                {stats.recentOrders.map((order) => {
                  const statusInfo = translateStatus(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#682D43]">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#4A1D2E]">
                        {order.customer.name}
                        <span className="block text-[10px] text-gray-400 font-mono dir-ltr text-right">
                          {order.customer.phone}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{order.customer.city}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.orderType === 'wholesale'
                              ? 'bg-[#C5A059]/20 text-[#682D43]'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {order.orderType === 'wholesale' ? 'جملة' : 'قطاعي'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        {order.items.length} أصناف
                      </td>
                      <td className="py-3.5 px-4 font-mono font-black text-[#682D43]">
                        {formatSAR(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.bgClass} ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {formatDateAr(order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] inline-flex items-center gap-1 transition-colors"
                          title="عرض تفاصيل الطلب"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold">تفاصيل</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

