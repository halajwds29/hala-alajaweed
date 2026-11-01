'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { formatSAR } from '@/lib/utils';

interface AdminProductsListClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function AdminProductsListClient({
  initialProducts,
  categories,
}: AdminProductsListClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من رغبتك في حذف المنتج «${name}» بشكل نهائي؟`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(data.error || 'فشل حذف المنتج');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إدارة المنتجات والأصناف</h1>
          <p className="text-xs text-[#6E6468]">
            إجمالي المنتجات المسجلة ({products.length} منتج) مع كامل خيارات البيع والأسعار
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E7DCD0] shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="ابحث بالاسم أو الرابط..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-60 px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none font-medium"
        >
          <option value="all">جميع الأقسام</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#FAF6F0] text-[#4A1D2E] border-b border-[#E7DCD0]">
              <tr>
                <th className="py-3 px-4 font-bold">الصورة</th>
                <th className="py-3 px-4 font-bold">المنتج</th>
                <th className="py-3 px-4 font-bold">القسم</th>
                <th className="py-3 px-4 font-bold">خيارات البيع (Variants)</th>
                <th className="py-3 px-4 font-bold">السعرات</th>
                <th className="py-3 px-4 font-bold">الحالة</th>
                <th className="py-3 px-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7F1E9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    لا توجد منتجات مطابقة لبحثك.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const primaryImg =
                    prod.images.find((i) => i.isPrimary)?.url ||
                    prod.images[0]?.url ||
                    'https://images.unsplash.com/photo-1598233847372-520e541434c4?auto=format&fit=crop&w=200&q=80';

                  const defaultPrice = prod.variants[0]?.retailPrice || 0;

                  return (
                    <tr key={prod._id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      {/* Image */}
                      <td className="py-3 px-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#F7F1E9] border border-[#E7DCD0]">
                          <Image
                            src={primaryImg}
                            alt={prod.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-[#4A1D2E] flex items-center gap-1.5">
                          <span>{prod.name}</span>
                          {prod.isFeatured && (
                            <span title="منتج مميز">
                              <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          /{prod.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-[#682D43] font-medium">
                        {prod.categoryName || prod.categorySlug}
                      </td>

                      {/* Variants */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-[#4A1D2E]">
                            {prod.variants.length} خيارات بيع
                          </span>
                          <span className="block text-[11px] text-gray-500 font-mono">
                            يبدأ من {formatSAR(defaultPrice)}
                          </span>
                        </div>
                      </td>

                      {/* Calories */}
                      <td className="py-3 px-4">
                        {prod.calories ? (
                          <span className="inline-flex items-center text-[11px] text-[#682D43] bg-[#FAF6F0] px-2 py-0.5 rounded-full border border-[#EBE3D7] font-medium">
                            {prod.calories} سعرة
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.isAvailable
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {prod.isAvailable ? 'متوفر' : 'غير متوفر'}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.isPublished
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {prod.isPublished ? 'منشور' : 'مسودة'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-gray-600 transition-colors"
                            title="معاينة بالمتجر"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/admin/products/${prod._id}`}
                            className="p-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] transition-colors"
                            title="تعديل المنتج والخيارات"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(prod._id, prod.name)}
                            disabled={isDeleting === prod._id}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                            title="حذف المنتج"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
