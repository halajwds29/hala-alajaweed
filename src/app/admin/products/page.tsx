import React from 'react';
import { getAllProductsAdmin, getAllCategoriesAdmin } from '@/lib/data-service';
import AdminProductsListClient from '@/components/admin/AdminProductsListClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getAllCategoriesAdmin(),
  ]);

  return <AdminProductsListClient initialProducts={products} categories={categories} />;
}

