import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getCategories, getProducts } from '@/lib/data-service';
import ProductsFilterView from '@/components/ProductsFilterView';
import { ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: 'القسم غير موجود' };

  return {
    title: `${category.name} | حلا الأجاويد`,
    description: category.description || `استكشف تشكيلات ${category.name} من مؤسسة حلا الأجاويد للحلويات.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, allCategories, allProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories(),
    getProducts(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryProducts = allProducts.filter((p) => p.categorySlug === slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#9F6A76]">
        <Link href="/" className="hover:text-[#682D43]">
          الرئيسية
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-[#682D43]">
          المنتجات
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#4A1D2E] font-bold">{category.name}</span>
      </nav>

      {/* Category Banner */}
      <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-[#E7DCD0]">
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E] mb-2">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-[#6E6468] max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Filter and Products List */}
      <ProductsFilterView
        initialProducts={categoryProducts}
        categories={allCategories}
        initialCategorySlug={slug}
      />
    </div>
  );
}

