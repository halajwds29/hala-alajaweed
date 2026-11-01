import React from 'react';
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/data-service';
import ProductsFilterView from '@/components/ProductsFilterView';

export const metadata: Metadata = {
  title: 'جميع المنتجات والتشكيلات الفاخرة',
  description:
    'تصفح كافة تشكيلات حلا الأجاويد من البقلاوة، الكليجا، معمول التمر، الشوكولاتة، والبوكسات الملكية بأسعار القطاعي والجملة.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A1D2E]">
          قائمة منتجات حلا الأجاويد
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6468]">
          اختر من بين تشكيلاتنا المتنوعة بالقطعة، بالعلبة، بالوزن، أو بالحجم مع أسعار قطاعي وخيارات جملة
          خاصة للمناسبات والتوريد.
        </p>
      </div>

      {/* Filter and Grid */}
      <ProductsFilterView initialProducts={products} categories={categories} />
    </div>
  );
}

