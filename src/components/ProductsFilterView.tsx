'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, Store } from 'lucide-react';

interface ProductsFilterViewProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategorySlug?: string;
}

export default function ProductsFilterView({
  initialProducts,
  categories,
  initialCategorySlug = 'all',
}: ProductsFilterViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceSort, setPriceSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [onlyWholesale, setOnlyWholesale] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all' && product.categorySlug !== selectedCategory) {
        return false;
      }
      // Wholesale filter
      if (onlyWholesale && !product.variants.some((v) => v.isWholesaleAvailable && v.wholesalePrice > 0)) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (priceSort === 'asc') {
        const priceA = a.variants[0]?.retailPrice || 0;
        const priceB = b.variants[0]?.retailPrice || 0;
        return priceA - priceB;
      }
      if (priceSort === 'desc') {
        const priceA = a.variants[0]?.retailPrice || 0;
        const priceB = b.variants[0]?.retailPrice || 0;
        return priceB - priceA;
      }
      return 0;
    });
  }, [initialProducts, selectedCategory, onlyWholesale, searchQuery, priceSort]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7DCD0] shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="ابحث عن منتج، كليجا، بقلاوة، شوكولاتة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs sm:text-sm bg-[#FAF6F0]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>

          {/* Sort order */}
          <div className="md:col-span-3">
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as 'default' | 'asc' | 'desc')}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E7DCD0] focus:outline-none focus:border-[#682D43] text-xs sm:text-sm bg-[#FAF6F0] font-medium"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="asc">السعر: من الأقل للأعلى</option>
              <option value="desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>

          {/* Wholesale toggle button */}
          <div className="md:col-span-3">
            <button
              onClick={() => setOnlyWholesale(!onlyWholesale)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                onlyWholesale
                  ? 'bg-[#682D43] text-white border-[#682D43]'
                  : 'bg-[#FAF6F0] text-[#682D43] border-[#E7DCD0] hover:bg-[#682D43]/10'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{onlyWholesale ? 'عرض خيارات الجملة فقط' : 'تصفية أسعار الجملة'}</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#682D43] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#4A1D2E] hover:bg-[#EFE6D8]'
            }`}
          >
            جميع الأقسام ({initialProducts.length})
          </button>
          {categories.map((cat) => {
            const count = initialProducts.filter((p) => p.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#682D43] text-white shadow-xs'
                    : 'bg-[#FAF6F0] text-[#4A1D2E] hover:bg-[#EFE6D8]'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#6E6468] px-1">
        <span>
          عرض <strong className="text-[#4A1D2E]">{filteredProducts.length}</strong> منتج
        </span>
        {onlyWholesale && (
          <span className="text-[#682D43] font-bold">
            مُفعل: عرض المنتجات التي تحتوي على خيارات بيع بالجملة
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7DCD0] p-8 sm:p-12 text-center text-[#9F6A76] space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto text-[#682D43]">
            <SlidersHorizontal className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-[#4A1D2E]">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs max-w-sm mx-auto">
            جرب تغيير كلمات البحث أو اختيار قسم آخر لعرض تشكيلات حلا الأجاويد.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setOnlyWholesale(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#682D43] text-white text-xs font-bold hover:bg-[#522234]"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

