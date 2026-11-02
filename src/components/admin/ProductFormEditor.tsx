'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload,
  Trash2,
  Plus,
  Star,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { Product, ProductVariant, ProductImage, Category, SaleMethod, DiscountType } from '@/types';
import { uploadMultipleFilesSafe } from '@/lib/client-image-compressor';

interface ProductFormEditorProps {
  initialProduct?: Product;
  categories: Category[];
}

export default function ProductFormEditor({
  initialProduct,
  categories,
}: ProductFormEditorProps) {
  const router = useRouter();
  const isEditing = !!initialProduct;

  // Basic Info
  const [name, setName] = useState(initialProduct?.name || '');
  const [nameEn, setNameEn] = useState(initialProduct?.nameEn || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [categorySlug, setCategorySlug] = useState(
    initialProduct?.categorySlug || categories[0]?.slug || 'eastern-sweets-baklava'
  );
  const [shortDescription, setShortDescription] = useState(
    initialProduct?.shortDescription || ''
  );
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Attributes
  const [calories, setCalories] = useState<number | ''>(initialProduct?.calories ?? '');
  const [caloriesBasis, setCaloriesBasis] = useState(
    initialProduct?.caloriesBasis || 'لكل 100 جرام'
  );
  const [weight, setWeight] = useState(initialProduct?.weight || '');

  // Toggles
  const [isAvailable, setIsAvailable] = useState(
    initialProduct?.isAvailable !== undefined ? initialProduct.isAvailable : true
  );
  const [isPublished, setIsPublished] = useState(
    initialProduct?.isPublished !== undefined ? initialProduct.isPublished : true
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(
    initialProduct?.seoDescription || ''
  );

  // Images (Up to 20 images per product)
  const [images, setImages] = useState<ProductImage[]>(initialProduct?.images || []);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [uploadWarning, setUploadWarning] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [dragOverImage, setDragOverImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialProduct?.variants || [
      {
        id: `var-${Date.now()}-1`,
        name: 'علبة 12 حبة',
        saleMethod: 'box',
        unitValue: 12,
        unitName: 'علبة (12 حبة)',
        retailPrice: 50,
        retailDiscount: 0,
        retailDiscountType: 'percentage',
        wholesalePrice: 38,
        wholesaleDiscount: 0,
        wholesaleDiscountType: 'percentage',
        minWholesaleQty: 10,
        isWholesaleAvailable: true,
        isAvailable: true,
        sortOrder: 1,
      },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-generate slug from Arabic name if new and empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && !slug) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[\s\-_]+/g, '-')
        .replace(/[^\u0621-\u064A\w-]/g, '');
      setSlug(generated || `product-${Date.now()}`);
    }
  };

  // Image Upload Handler (Supports multiple files from device at once, safely chunked & compressed)
  const uploadFilesList = async (files: File[]) => {
    if (files.length === 0) return;

    if (images.length + files.length > 25) {
      alert(`الحد الأقصى المسموح به هو 25 صورة لكل منتج. يمكنك إضافة حتى ${Math.max(0, 25 - images.length)} صورة إضافية.`);
      return;
    }

    setUploadingImage(true);
    setUploadWarning('');
    setUploadProgressText(`جاري تهيئة ${files.length} صور للرفع...`);

    try {
      const result = await uploadMultipleFilesSafe(
        files,
        'hala_alajaweed/products',
        (progress) => {
          setUploadProgressText(
            `جاري ضغط ورفع (${progress.current} من ${progress.total}) — ${progress.percentage}%`
          );
        }
      );

      if (result.succeeded.length > 0) {
        const newUploaded: ProductImage[] = result.succeeded.map((item, idx) => ({
          url: item.url,
          publicId: item.publicId,
          isPrimary: images.length === 0 && idx === 0,
          sortOrder: images.length + idx + 1,
        }));

        setImages((prev) => [...prev, ...newUploaded]);
      }

      if (result.failed.length > 0) {
        const errorList = result.failed.map((f) => `• ${f.fileName}: ${f.reason}`).join('\n');
        alert(`تم رفع ${result.succeeded.length} من أصل ${files.length} صورة.\n\nتعذر رفع التالي:\n${errorList}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل رفع الصور';
      alert(msg);
    } finally {
      setUploadingImage(false);
      setUploadProgressText('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    uploadFilesList(files);
    e.target.value = '';
  };

  const handleAddDirectUrl = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    if (images.length >= 20) {
      alert('الحد الأقصى المسموح به هو 20 صورة لكل منتج.');
      return;
    }
    const newImage: ProductImage = {
      url: trimmed,
      isPrimary: images.length === 0,
      sortOrder: images.length + 1,
    };
    setImages((prev) => [...prev, newImage]);
    setCustomImageUrl('');
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleDeleteImage = async (index: number) => {
    const imgToDelete = images[index];
    if (imgToDelete.publicId && !imgToDelete.publicId.startsWith('local-temp-')) {
      try {
        await fetch(`/api/admin/upload?publicId=${encodeURIComponent(imgToDelete.publicId)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete image from cloud', err);
      }
    }

    const updated = images.filter((_, i) => i !== index);
    if (imgToDelete.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  // Variants Handlers
  const addVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: 'خيار بيع جديد',
      saleMethod: 'piece',
      unitValue: 1,
      unitName: 'قطعة',
      retailPrice: 20,
      retailDiscount: 0,
      retailDiscountType: 'percentage',
      wholesalePrice: 15,
      wholesaleDiscount: 0,
      wholesaleDiscountType: 'percentage',
      minWholesaleQty: 10,
      isWholesaleAvailable: true,
      isAvailable: true,
      sortOrder: variants.length + 1,
    };
    setVariants((prev) => [...prev, newVar]);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    setVariants((prev) => {
      const copy = [...prev];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      copy[index] = { ...copy[index], [field]: value } as any;
      return copy;
    });
  };

  const removeVariant = (index: number) => {
    if (variants.length <= 1) {
      alert('يجب الإبقاء على خيار بيع واحد على الأقل للمنتج.');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('اسم المنتج مطلوب.');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('رابط Slug التعريفي مطلوب.');
      return;
    }
    if (variants.length === 0) {
      setErrorMessage('يرجى إضافة خيار بيع واحد على الأقل.');
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      nameEn: nameEn.trim(),
      slug: slug.trim(),
      categorySlug,
      categoryName: categories.find((c) => c.slug === categorySlug)?.name || '',
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      images,
      calories: calories !== '' ? Number(calories) : undefined,
      caloriesBasis,
      weight,
      isAvailable,
      isPublished,
      isFeatured,
      seoTitle: seoTitle.trim() || name.trim(),
      seoDescription: seoDescription.trim() || shortDescription.trim(),
      variants,
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${initialProduct._id}`
        : '/api/admin/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ المنتج');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ';
      setErrorMessage(msg);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0]">
        <div>
          <Link
            href="/admin/products"
            className="text-xs text-[#9F6A76] hover:text-[#682D43] flex items-center gap-1 mb-1"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لقائمة المنتجات</span>
          </Link>
          <h1 className="text-2xl font-black text-[#4A1D2E]">
            {isEditing ? `تعديل الصنف: ${name}` : 'إضافة صنف جديد'}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl border border-[#E7DCD0] bg-white text-xs font-bold hover:bg-[#FAF6F0]"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ ونشر التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Basic Information */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
          المعلومات الأساسية
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              اسم المنتج بالعربي <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: بقلاوة الأجاويد بالفستق الحلبي"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              الاسم بالإنجليزي (اختياري)
            </label>
            <input
              type="text"
              placeholder="Royal Pistachio Baklava"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43] dir-ltr text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              الرابط التعريفي الفريد (Slug) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="royal-pistachio-baklava"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              القسم والتصنيف <span className="text-rose-600">*</span>
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none font-medium"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
            الوصف المختصر (يظهر في البطاقات وقوائم البحث)
          </label>
          <textarea
            rows={2}
            placeholder="وصف جذاب من سطرين يبرز مكونات الصنف ونكهته..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] resize-none focus:outline-none focus:border-[#682D43]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
            الوصف التفصيلي (يظهر في صفحة الصنف)
          </label>
          <textarea
            rows={4}
            placeholder="اكتب بالتفصيل عن طريقة الصنع، تاريخ الوصفة، مكونات الحشوة، والسمن المستخدم..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] resize-none focus:outline-none focus:border-[#682D43]"
          />
        </div>
      </div>

      {/* 2. Image Management (حتى 4 صور مع Cloudinary) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E]">معرض صور المنتج (4 صور أو أكثر)</h2>
            <p className="text-xs text-[#9F6A76]">
              يمكنك رفع 4 صور أو أكثر للمنتج، واختيار الصورة الرئيسية، وترتيبها وحذفها بسهولة
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#682D43] border border-[#E7DCD0]">
            {images.length} صورة مرفوعة
          </span>
        </div>

        {uploadWarning && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            {uploadWarning}
          </div>
        )}

        {/* Existing Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl overflow-hidden border-2 p-1.5 flex flex-col justify-between ${
                img.isPrimary
                  ? 'border-[#682D43] bg-[#FAF6F0] ring-2 ring-[#682D43]/20'
                  : 'border-[#E7DCD0] bg-white'
              }`}
            >
              <div className="relative w-full pt-[90%] rounded-xl overflow-hidden bg-gray-100">
                <Image src={img.url} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="150px" />
                {img.isPrimary && (
                  <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-[#682D43] text-white text-[10px] font-bold shadow">
                    الرئيسية ★
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 px-1">
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                    img.isPrimary
                      ? 'text-[#682D43] font-black'
                      : 'text-gray-500 hover:text-[#682D43]'
                  }`}
                >
                  {img.isPrimary ? 'الصورة الرئيسية' : 'تعيين كرئيسية'}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteImage(idx)}
                  className="text-gray-400 hover:text-rose-600 p-1"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Image Upload Card with Drag & Drop */}
          {images.length < 20 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverImage(true);
              }}
              onDragLeave={() => setDragOverImage(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverImage(false);
                if (e.dataTransfer.files) {
                  uploadFilesList(Array.from(e.dataTransfer.files));
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[170px] ${
                dragOverImage
                  ? 'border-[#682D43] bg-[#682D43]/10 scale-[0.98]'
                  : 'border-[#682D43]/40 hover:border-[#682D43] bg-[#FAF6F0] hover:bg-[#FAF6F0]/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              {uploadingImage ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-[#682D43] mb-2" />
                  <span className="text-xs font-bold text-[#682D43]">
                    {uploadProgressText || 'جاري الرفع...'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-white text-[#682D43] flex items-center justify-center mb-2 shadow-2xs border border-[#E7DCD0]">
                    <Upload className="w-5 h-5 text-[#682D43]" />
                  </div>
                  <span className="text-xs font-bold text-[#4A1D2E]">
                    رفع صور من الجهاز
                  </span>
                  <span className="text-[10px] text-gray-500 mt-1">
                    انقر أو اسحب 4 صور أو أكثر معاً
                  </span>
                  <span className="text-[9px] text-[#9F6A76] mt-0.5">
                    (JPG, PNG, WebP)
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Direct Image URL input option */}
        <div className="pt-2 border-t border-[#E7DCD0]/70 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="url"
            placeholder="أو أضف رابط صورة مباشر (مثل: https://example.com/image.jpg أو /images/products/...)"
            value={customImageUrl}
            onChange={(e) => setCustomImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDirectUrl();
              }
            }}
            className="flex-1 px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none focus:border-[#682D43] w-full"
          />
          <button
            type="button"
            onClick={handleAddDirectUrl}
            disabled={!customImageUrl.trim() || images.length >= 20}
            className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold border border-[#E7DCD0] transition-colors whitespace-nowrap disabled:opacity-50 w-full sm:w-auto"
          >
            إضافة الرابط
          </button>
        </div>
      </div>

      {/* 3. Product Variants (خيارات البيع: قطعة، علبة، وزن، حجم) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E]">
              خيارات البيع وأسعار القطاعي والجملة (Variants)
            </h2>
            <p className="text-xs text-[#9F6A76]">
              حدد طرق البيع (بالقطعة، بالعلبة، بالوزن، بالحجم) مع سعر القطاعي وسعر الجملة والحد الأدنى
            </p>
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold border border-[#E7DCD0] flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خيار بيع جديد</span>
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((v, idx) => (
            <div
              key={v.id || idx}
              className="p-4 sm:p-5 rounded-2xl border border-[#E7DCD0] bg-[#FAF6F0]/60 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E7DCD0]">
                <span className="font-bold text-xs text-[#4A1D2E]">
                  خيار بيع #{idx + 1}: {v.name || 'بدون اسم'}
                </span>
                <button
                  type="button"
                  onClick={() => removeVariant(idx)}
                  className="text-rose-600 hover:text-rose-800 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الخيار</span>
                </button>
              </div>

              {/* Row 1: Name, Method, Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    اسم الخيار (يظهر للعميل)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: علبة 12 حبة، نصف كيلو..."
                    value={v.name}
                    onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    طريقة البيع
                  </label>
                  <select
                    value={v.saleMethod}
                    onChange={(e) => updateVariant(idx, 'saleMethod', e.target.value as SaleMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none font-medium"
                  >
                    <option value="piece">بالقطعة (Piece)</option>
                    <option value="box">بالعلبة (Box)</option>
                    <option value="weight">بالوزن (Weight)</option>
                    <option value="size">بالحجم (Size)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    وصف الوحدة
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قطعة، علبة، كجم، VIP"
                    value={v.unitName}
                    onChange={(e) => updateVariant(idx, 'unitName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Retail Pricing */}
              <div className="p-3 bg-white rounded-xl border border-[#E7DCD0] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#682D43] mb-1">
                    سعر القطاعي (ر.س) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    required
                    value={v.retailPrice}
                    onChange={(e) => updateVariant(idx, 'retailPrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#682D43] mb-1">
                    خصم القطاعي
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={v.retailDiscount}
                    onChange={(e) => updateVariant(idx, 'retailDiscount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#682D43] mb-1">
                    نوع خصم القطاعي
                  </label>
                  <select
                    value={v.retailDiscountType}
                    onChange={(e) => updateVariant(idx, 'retailDiscountType', e.target.value as DiscountType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="amount">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Wholesale Pricing */}
              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#C5A059]/40 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    سعر الجملة (ر.س)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={v.wholesalePrice}
                    onChange={(e) => updateVariant(idx, 'wholesalePrice', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    الحد الأدنى للجملة (كمية)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={v.minWholesaleQty}
                    onChange={(e) => updateVariant(idx, 'minWholesaleQty', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    خصم إضافي للجملة
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={v.wholesaleDiscount}
                    onChange={(e) => updateVariant(idx, 'wholesaleDiscount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                    نوع خصم الجملة
                  </label>
                  <select
                    value={v.wholesaleDiscountType}
                    onChange={(e) => updateVariant(idx, 'wholesaleDiscountType', e.target.value as DiscountType)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="amount">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Nutritional & Physical Specs */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
          المواصفات الغذائية والأبعاد
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              السعرات الحرارية
            </label>
            <input
              type="number"
              placeholder="مثال: 420"
              value={calories}
              onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              قاعدة احتساب السعرات
            </label>
            <input
              type="text"
              placeholder="لكل 100 جرام / لكل حبة"
              value={caloriesBasis}
              onChange={(e) => setCaloriesBasis(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              الوزن أو الحجم العام
            </label>
            <input
              type="text"
              placeholder="مثال: 500 جرام، تنكة 1 كجم"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Status & Visibility Toggles */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
          حالة النشر والظهور
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="p-4 rounded-2xl border border-[#E7DCD0] bg-[#FAF6F0] flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#4A1D2E] block">حالة التوافر</span>
              <span className="text-[11px] text-[#6E6468]">جاهز للطلب بالمخزون</span>
            </div>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 accent-[#682D43] cursor-pointer"
            />
          </label>

          <label className="p-4 rounded-2xl border border-[#E7DCD0] bg-[#FAF6F0] flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#4A1D2E] block">نشر في المتجر</span>
              <span className="text-[11px] text-[#6E6468]">ظاهر للعملاء بالموقع</span>
            </div>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-5 h-5 accent-[#682D43] cursor-pointer"
            />
          </label>

          <label className="p-4 rounded-2xl border border-[#E7DCD0] bg-[#FAF6F0] flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-[#4A1D2E] block">منتج مميز (Featured)</span>
              <span className="text-[11px] text-[#6E6468]">يظهر في واجهة الرئيسية</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-5 h-5 accent-[#682D43] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 6. SEO Settings */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
          إعدادات محركات البحث (SEO)
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              عنوان الصفحة في جوجل (SEO Title)
            </label>
            <input
              type="text"
              placeholder={name || 'اسم المنتج | حلا الأجاويد'}
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              وصف محركات البحث (SEO Description)
            </label>
            <textarea
              rows={2}
              placeholder="وصف مختصر يظهر في نتائج البحث..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] resize-none focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[#E7DCD0]">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ التعديلات ونشر المنتج</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

