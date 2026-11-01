import React from 'react';
import { notFound } from 'next/navigation';
import { getProductById, getAllCategoriesAdmin } from '@/lib/data-service';
import ProductFormEditor from '@/components/admin/ProductFormEditor';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0;

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategoriesAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductFormEditor initialProduct={product} categories={categories} />;
}

