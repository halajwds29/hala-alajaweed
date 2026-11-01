import React from 'react';
import { getAllCategoriesAdmin } from '@/lib/data-service';
import ProductFormEditor from '@/components/admin/ProductFormEditor';

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await getAllCategoriesAdmin();
  return <ProductFormEditor categories={categories} />;
}

