import React from 'react';
import type { Metadata } from 'next';
import { getOrderByNumber } from '@/lib/data-service';
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

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OrderSuccessClient initialOrder={order} orderNumber={orderNumber} />
    </div>
  );
}
