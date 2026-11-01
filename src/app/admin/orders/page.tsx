import React from 'react';
import { getOrders } from '@/lib/data-service';
import AdminOrdersListClient from '@/components/admin/AdminOrdersListClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersListClient initialOrders={orders} />;
}

