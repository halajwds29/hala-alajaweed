import React from 'react';
import { getAllCategoriesAdmin } from '@/lib/data-service';
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesAdmin();
  return <AdminCategoriesClient initialCategories={categories} />;
}

