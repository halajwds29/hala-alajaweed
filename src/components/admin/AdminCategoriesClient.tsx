'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, Layers, Loader2 } from 'lucide-react';
import { Category } from '@/types';
import DeviceImageUploader from './DeviceImageUploader';

interface AdminCategoriesClientProps {
  initialCategories: Category[];
}

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingCategory({
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      image: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name || !editingCategory?.slug) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ القسم');
      }

      const savedCat: Category = data.category;
      setCategories((prev) => {
        const idx = prev.findIndex((c) => c._id === savedCat._id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = savedCat;
          return copy.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return [...prev, savedCat].sort((a, b) => a.sortOrder - b.sortOrder);
      });

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في الحفظ';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف القسم «${name}»؟ لن يتم حذف منتجاته ولكن سيصبح بدون تصنيف رئيسي.`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert(data.error || 'فشل الحذف');
      }
    } catch {
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const toggleActive = async (cat: Category) => {
    const updated = { ...cat, isActive: !cat.isActive };
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) =>
          prev.map((c) => (c._id === cat._id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إدارة أقسام وتصنيفات المتجر</h1>
          <p className="text-xs text-[#6E6468]">
            إجمالي الأقسام ({categories.length}) — يمكنك إضافة، تعديل، ترتيب، أو إخفاء أي قسم.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-2xs flex flex-col justify-between transition-all ${
              cat.isActive ? 'border-[#E7DCD0]' : 'border-gray-300 opacity-60'
            }`}
          >
            <div>
              {/* Image banner */}
              <div className="relative w-full pt-[45%] bg-[#FAF6F0]">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#9F6A76]">
                    <Layers className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-[#4A1D2E] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  الترتيب: {cat.sortOrder}
                </span>
                <span
                  className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                    cat.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-white'
                  }`}
                >
                  {cat.isActive ? 'مفعل' : 'مخفي'}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#4A1D2E]">{cat.name}</h3>
                {cat.nameEn && (
                  <p className="text-[10px] text-[#9F6A76] font-medium font-mono">{cat.nameEn}</p>
                )}
                <p className="text-[11px] text-[#6E6468] line-clamp-2 leading-relaxed">
                  {cat.description || 'لا يوجد وصف مضاف لهذا القسم.'}
                </p>
                <span className="block text-[10px] text-gray-400 font-mono mt-1">
                  الرابط: /categories/{cat.slug}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-[#FAF6F0] border-t border-[#E7DCD0] flex items-center justify-between">
              <button
                onClick={() => toggleActive(cat)}
                className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  cat.isActive
                    ? 'text-gray-600 hover:text-amber-800'
                    : 'text-emerald-700 font-black'
                }`}
              >
                {cat.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>إخفاء</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>إظهار</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 rounded-lg bg-white hover:bg-[#682D43] hover:text-white text-[#682D43] border border-[#E7DCD0] transition-colors"
                  title="تعديل القسم"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition-colors"
                  title="حذف القسم"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Category */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E7DCD0] space-y-4">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
              {editingCategory._id ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  اسم القسم بالعربي <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الحلويات الشرقية والبقلاوة"
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const n = e.target.value;
                    const s = editingCategory._id
                      ? editingCategory.slug
                      : n.trim().toLowerCase().replace(/[\s\-_]+/g, '-');
                    setEditingCategory({ ...editingCategory, name: n, slug: s });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  الاسم بالإنجليزي
                </label>
                <input
                  type="text"
                  placeholder="Eastern Sweets & Baklava"
                  value={editingCategory.nameEn || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  الرابط التعريفي (Slug) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="eastern-sweets-baklava"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none font-mono dir-ltr text-right"
                />
              </div>

              <div>
                <DeviceImageUploader
                  label="صورة القسم"
                  description="ارفع صورة القسم مباشرة من جهازك (كمبيوتر أو جوال)"
                  value={editingCategory.image || ''}
                  onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                  folder="hala_alajaweed/categories"
                  aspectRatio="wide"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A1D2E] mb-1">
                    ترتيب الظهور
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCategory.sortOrder || 1}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        sortOrder: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="catActive"
                    checked={editingCategory.isActive ?? true}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#682D43]"
                  />
                  <label htmlFor="catActive" className="font-bold text-[#4A1D2E] cursor-pointer">
                    القسم نشط ومعروض
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  وصف القسم
                </label>
                <textarea
                  rows={3}
                  placeholder="وصف مختصر لمحتويات القسم..."
                  value={editingCategory.description || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] resize-none focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7DCD0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7DCD0] text-gray-600 hover:bg-[#FAF6F0]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#682D43] text-white font-bold hover:bg-[#522234] shadow"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

