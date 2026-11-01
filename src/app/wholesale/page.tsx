import React from 'react';
import type { Metadata } from 'next';
import {
  Store,
  Clock,
  PackageCheck,
  TrendingDown,
  Phone,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { getProducts, getCategories } from '@/lib/data-service';
import ProductsFilterView from '@/components/ProductsFilterView';

export const metadata: Metadata = {
  title: 'طلبات الجملة والتوريد التجاري',
  description:
    'خدمات توريد الحلويات الشعبية والشرقية والشوكولاتة للمقاهي والفنادق وقاعات الأفراح بأسعار جملة تنافسية من مؤسسة حلا الأجاويد.',
};

export const revalidate = 60;

export default async function WholesalePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Filter only products that support wholesale
  const wholesaleProducts = products.filter((p) =>
    p.variants.some((v) => v.isWholesaleAvailable && v.wholesalePrice > 0)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Luxury Header on Warm Ivory */}
      <div className="bg-[#FAF6F0] rounded-3xl p-8 sm:p-12 md:p-14 border border-[#EBE3D7] relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE6D8] text-[#682D43] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span>خدمة التوريد والجملة الرسمية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4A1D2E] font-serif leading-tight">
            حلويات سعودية فاخرة
            <span className="block text-[#682D43] font-normal text-2xl sm:text-3xl mt-1">
              بأسعار الجملة لمشروعك ومناسبتك
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#6B5E62] max-w-2xl leading-relaxed">
            نقدم في مؤسسة حلا الأجاويد حلول توريد مرنة ومتكاملة لقطاع الضيافة والمقاهي والفنادق
            والشركات، بالإضافة إلى تجهيز كميات صواني الأفراح والمناسبات الكبرى، مع ضمان أعلى معايير
            الجودة وثبات المذاق.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <a
              href="https://wa.me/966546002435?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%B7%D9%84%D8%A8%20%D8%AA%D8%B3%D8%B9%D9%8A%D8%B1%D8%A9%20%D8%AC%D9%85%D9%84%D8%A9%20%D9%88%D8%AA%D9%88%D8%B1%D9%8A%D8%AF%20%D9%85%D9%86%20%D8%AD%D9%84%D8%A7%20%D8%A7%D9%84%D8%A3%D8%AC%D8%A7%D9%88%D9%8A%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#682D43] hover:bg-[#522234] text-[#FAF6F0] text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة مسؤول المبيعات والتوريد عبر واتساب</span>
            </a>

            <a
              href="tel:+966546002435"
              className="px-6 py-3 rounded-full bg-white hover:bg-[#EFE6D8] text-[#4A1D2E] text-xs font-bold border border-[#EBE3D7] transition-colors flex items-center gap-2 dir-ltr font-mono"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>+966 54 600 2435</span>
            </a>
          </div>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#4A1D2E]">أسعار تفضيلية مجدية</h3>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            خصومات تصاعدية تبدأ فور استيفاء الحد الأدنى للكمية المحدد لكل صنف بالمتجر.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#4A1D2E]">تعبئة وتغليف مخصص</h3>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            إمكانية التوريد بكراتين ضخمة للمقاهي أو علب فاخرة للإهداءات الرسمية.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#4A1D2E]">ثبات الجودة والإنتاج</h3>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            معايير صارمة وثابتة للطعم والجودة دون أي تفاوت في الدفعات اليومية.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3D7] shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center">
            <Clock className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h3 className="font-bold text-sm text-[#4A1D2E]">تنسيق سريع ومباشر</h3>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            متابعة دقيقة لكل طلب من وقت الاعتماد وحتى استلام الشحنة في موقعكم.
          </p>
        </div>
      </div>

      {/* Wholesale Catalog Header */}
      <div className="border-t border-[#EBE3D7] pt-8 space-y-6">
        <div>
          <span className="text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
            قائمة الأصناف
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A1D2E] font-serif mt-1">
            منتجات متاحة بسعر الجملة
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E62] mt-1">
            يمكنكم تصفح المنتجات التالية وإضافتها مباشرة للسلة بأسعار الجملة بعد تحديد الحد الأدنى للكمية
          </p>
        </div>

        {/* Filter View */}
        <ProductsFilterView
          initialProducts={wholesaleProducts}
          categories={categories}
        />
      </div>
    </div>
  );
}
