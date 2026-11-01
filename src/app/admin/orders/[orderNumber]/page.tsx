import React from 'react';
import { notFound } from 'next/navigation';
import { getOrderByNumber } from '@/lib/data-service';
import AdminOrderDetailsClient from '@/components/admin/AdminOrderDetailsClient';

interface AdminOrderDetailsPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const revalidate = 0;

export default async function AdminOrderDetailsPage({ params }: AdminOrderDetailsPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return <AdminOrderDetailsClient initialOrder={order} />;
}

