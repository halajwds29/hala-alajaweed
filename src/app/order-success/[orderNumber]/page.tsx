import React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getOrderByNumber } from '@/lib/data-service';
import { getAdminSession } from '@/lib/auth';
import OrderSuccessClient from '@/components/OrderSuccessClient';

interface OrderSuccessPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: OrderSuccessPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `تفاصيل الطلب ${orderNumber} | حلا الأجاويد`,
    robots: { index: false, follow: false },
  };
}

function maskName(name: string): string {
  if (!name) return 'عميل حلا الأجاويد';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2) + '***';
  return `${parts[0].slice(0, 2)}*** ${parts[parts.length - 1]}`;
}

function maskPhone(phone: string): string {
  if (!phone) return '05********';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 7) return '******';
  return clean.slice(0, 3) + '****' + clean.slice(-3);
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;
  const cleanOrderNumber = orderNumber.trim().toUpperCase();

  const cookieStore = await cookies();
  const token = cookieStore.get(`order_token_${cleanOrderNumber}`)?.value;
  const adminSession = await getAdminSession();
  const isAuthorized = !!token || !!adminSession;

  const rawOrder = await getOrderByNumber(cleanOrderNumber);

  // If not authorized owner or admin, mask personal data strictly
  const order = rawOrder && !isAuthorized ? {
    ...rawOrder,
    customer: {
      name: maskName(rawOrder.customer.name),
      phone: maskPhone(rawOrder.customer.phone),
      city: rawOrder.customer.city,
      district: rawOrder.customer.district,
      address: 'العنوان مؤكد ومحفوظ (تم إخفاء التفاصيل لحماية الخصوصية)',
    },
    customerNotes: rawOrder.customerNotes ? 'ملاحظات مسجلة' : '',
    adminNotes: '',
  } : rawOrder;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OrderSuccessClient initialOrder={order} orderNumber={cleanOrderNumber} />
    </div>
  );
}
