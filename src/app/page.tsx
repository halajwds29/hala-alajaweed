import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Store,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  ChevronDown,
} from 'lucide-react';
import { getCategories, getProducts, getBranches, getSiteSettings } from '@/lib/data-service';
import ProductCard from '@/components/ProductCard';
import InteractiveBranchesMap from '@/components/InteractiveBranchesMap';
import CategoriesMarquee from '@/components/CategoriesMarquee';
import HeroImageSlider from '@/components/HeroImageSlider';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, featuredProducts, allProducts, branches, settings] = await Promise.all([
    getCategories(),
    getProducts({ isFeatured: true, limit: 8 }),
    getProducts({ limit: 12 }),
    getBranches(true),
    getSiteSettings(),
  ]);

  const hailBranch = branches.find((b) => b.isHQ) || branches[0];

  return (
    <div className="flex flex-col gap-10 sm:gap-16 md:gap-24 pb-20 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* 1. Hero Section: Editorial Luxury on Warm Ivory */}
      <section className="relative overflow-hidden bg-[#FAF6F0] pt-4 sm:pt-8 md:pt-16 pb-8 sm:pb-12 md:pb-20 border-b border-[#EBE3D7] w-full max-w-full min-w-0">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center">
            {/* Editorial Copy */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#EFE6D8] text-[#682D43] text-[11px] sm:text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span>مؤسسة حلا الأجاويد للحلويات — حائل</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#4A1D2E] tracking-tight leading-[1.25] break-words">
                حلا الأجاويد
                <span className="block text-[#682D43] font-serif font-normal mt-1 text-xl sm:text-3xl md:text-4xl">
                  نكهات أصيلة ولمسات عصرية
                </span>
              </h1>

              <p className="text-xs sm:text-base text-[#6B5E62] leading-relaxed max-w-xl mx-auto lg:mx-0">
                اكتشف عالمًا من الحلويات الشعبية والشرقية والشوكولاتة والمعجنات ، بتشكيلات متنوعة تناسب
                ضيافتك ومناسباتك واحتياجاتك اليومية.
              </p>

              {/* Primary Call To Action + Secondary Links */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-3 sm:py-3.5 rounded-full bg-[#682D43] text-[#FAF6F0] hover:bg-[#522234] text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-lg active:scale-95 text-center shadow-sm"
                >
                  تسوّق الآن
                </Link>

                <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                  <a
                    href="#categories"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#682D43] hover:text-[#4A1D2E] transition-colors py-1.5 px-2.5"
                  >
                    <span>اكتشف أقسامنا</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C5A059]" />
                  </a>

                  <Link
                    href="/wholesale"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#9F6A76] hover:text-[#682D43] transition-colors py-1.5 px-2.5"
                  >
                    <span>الجملة والتوريد</span>
                    <ArrowLeft className="w-3 h-3 text-[#C5A059]" />
                  </Link>
                </div>
              </div>

              {/* Quality Accents */}
              <div className="pt-4 sm:pt-8 border-t border-[#EBE3D7] grid grid-cols-3 gap-2 sm:gap-6 text-center lg:text-right">
                <div>
                  <span className="block text-sm sm:text-lg font-bold text-[#682D43] font-serif">طبيعي ١٠٠٪</span>
                  <span className="text-[9px] sm:text-[11px] text-[#8C7D82] leading-tight block">سمن ومكونات ممتازة</span>
                </div>
                <div>
                  <span className="block text-sm sm:text-lg font-bold text-[#682D43] font-serif">حرفية متقنة</span>
                  <span className="text-[9px] sm:text-[11px] text-[#8C7D82] leading-tight block">إعداد يدوي طازج</span>
                </div>
                <div>
                  <span className="block text-sm sm:text-lg font-bold text-[#682D43] font-serif">ضيافة عريقة</span>
                  <span className="text-[9px] sm:text-[11px] text-[#8C7D82] leading-tight block">فخر التراث السعودي</span>
                </div>
              </div>
            </div>

            {/* Real Sweet Photography Slider */}
            <div className="lg:col-span-6 relative w-full max-w-full min-w-0">
              <HeroImageSlider
                images={
                  Array.isArray(settings.heroImages) && settings.heroImages.length > 0
                    ? settings.heroImages
                    : [settings.heroImageUrl || '/images/hero-patisserie.jpg']
                }
                alt="حلويات حلا الأجاويد الفاخرة"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section: Slow Smooth Marquee Animation from Right to Left */}
      <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 scroll-mt-24 w-full max-w-full min-w-0" style={{ overflowX: 'hidden' }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 border-b border-[#EBE3D7] pb-3 sm:pb-4">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
              التصنيفات
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#4A1D2E] font-serif mt-0.5">
              أقسام حلا الأجاويد
            </h2>
          </div>
          <span className="text-xs text-[#6B5E62] hidden sm:inline-block">
            تشكيلات متخصصة صُممت لتلبي أرقى مناسباتكم
          </span>
        </div>

        {/* Slow Smooth Right-to-Left Continuous Marquee */}
        <CategoriesMarquee categories={categories} />
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 md:mb-12 border-b border-[#EBE3D7] pb-3 sm:pb-4">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
              مختارات مميزة
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#4A1D2E] font-serif mt-0.5">
              مختارات الضيافة
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#682D43] hover:text-[#4A1D2E] transition-colors"
          >
            <span>استعراض كافة الحلويات ({allProducts.length})</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-columns on mobile, 4-columns on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-full min-w-0">
          {(featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 8)).map(
            (product) => (
              <ProductCard key={product._id} product={product} />
            )
          )}
        </div>
      </section>

      {/* 4. Brand Story: Editorial Luxury Feature */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full max-w-full min-w-0">
        <div className="bg-[#FAF6F0] rounded-3xl border border-[#EBE3D7] overflow-hidden p-5 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <span className="text-[11px] sm:text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
                أصالة وكرم
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#4A1D2E] font-serif">
                قصة حلا الأجاويد
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E62] leading-relaxed">
                من مدينة حائل العريقة المعروفة بأصالة الكرم وطيب الضيافة، انطلقت «مؤسسة حلا الأجاويد
                للحلويات» لتقديم تجربة حلوى سعودية ترقى لأعلى معايير الإتقان. نمزج بين وصفات التراث
                الشعبي الأصيل كالكليجا والمعمول، وبين أحدث فنون الشوكولاتة البلجيكية والبقلاوة المورقة
                والمعجنات الطازجة.
              </p>
              <p className="text-xs sm:text-sm text-[#6B5E62] leading-relaxed">
                نحرص في كل قطعة نخبزها على استخدام المكونات الطبيعية الصافية، والسمن البلدي الفاخر،
                والمكسرات المنتقاة حبة حبة، لتكون ضيافتكم دوماً عنواناً للفخامة والذوق الرفيع.
              </p>

              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#4A1D2E] font-bold">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>سمن ومكسرات ممتازة</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                  <span>معايير جودة ونظافة صارمة</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                  <span>جاهزية لكبرى المناسبات</span>
                </div>
              </div>
            </div>

            {/* Story Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/11] sm:aspect-square rounded-2xl overflow-hidden shadow-sm border border-[#EBE3D7]">
                <Image
                  src={settings.storyImageUrl || "/images/products/maamoul-real.jpg"}
                  alt="كرم الضيافة السعودية حلا الأجاويد"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Wholesale & B2B Section: Minimalist Invitation */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full max-w-full min-w-0">
        <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xs">
          <div className="max-w-xl space-y-2 text-center md:text-right">
            <span className="text-[11px] sm:text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
              قطاع الأعمال والمناسبات
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-[#4A1D2E] font-serif">
              طلبات الجملة والتوريد التجاري
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E62] leading-relaxed">
              نوفر أسعاراً تفضيلية وعقود توريد مرنة للمقاهي والفنادق وشركات الإعاشة ومنظمي الأفراح
              والمؤتمرات، بتشكيلات تلائم هوية مناسبتكم وبكميات مجدولة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/wholesale"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#682D43] text-[#FAF6F0] hover:bg-[#522234] text-xs font-bold transition-all shadow-xs text-center"
            >
              تقديم طلب جملة
            </Link>
            <a
              href="https://wa.me/966546002435?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%B7%D9%84%D8%A8%D8%A7%D8%AA%20%D8%A7%D9%84%D8%AC%D9%85%D9%84%D8%A9%20%D9%88%D8%A7%D9%84%D8%AA%D9%88%D8%B1%D9%8A%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FAF6F0] text-[#682D43] hover:bg-[#EFE6D8] border border-[#EBE3D7] text-xs font-bold transition-all text-center"
            >
              استفسار مباشر عبر واتساب
            </a>
          </div>
        </div>
      </section>

      {/* 6. Headquarters & National Address Locations */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 w-full max-w-full min-w-0">
        <div className="border-t border-[#EBE3D7] pt-8 sm:pt-12">
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
              المواقع والعناوين المعتمدة
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-[#4A1D2E] font-serif mt-0.5">
              أين تجدون حلا الأجاويد
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center md:text-right">
            {/* Hail HQ */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto md:mx-0 mb-3 group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#4A1D2E]">المقر والمصنع الرئيسي — حائل</h4>
                <p className="text-xs text-[#6B5E62] mt-1.5 leading-relaxed">
                  حي النقرة — شارع فهد العلي العريفي — حائل
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs text-[#9F6A76]">
                <span>المبيعات والمعرض</span>
                <span className="font-bold text-[#682D43]">9:00 ص - 11:30 م</span>
              </div>
            </div>

            {/* Riyadh National Address */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 text-[#682D43] flex items-center justify-center mx-auto md:mx-0 mb-3 group-hover:scale-105 transition-transform">
                  <Store className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm sm:text-base text-[#4A1D2E]">العنوان الوطني — الرياض</h4>
                  <span className="text-[10px] bg-[#FAF6F0] text-[#682D43] px-2 py-0.5 rounded font-mono font-bold border border-[#EBE3D7]">
                    RIUJ7218
                  </span>
                </div>
                <p className="text-xs text-[#6B5E62] mt-1.5 leading-relaxed">
                  العريجاء الغربية — شارع مارية القبطية — مبنى 7218 (إضافي 4732 - بريدي 14913)
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs">
                <a
                  href="https://maps.google.com/?q=24.594875%2C46.587509"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A059] font-bold hover:underline"
                >
                  فتح الموقع بالخرائط ←
                </a>
                <span className="text-[11px] text-[#9F6A76]">توريد وجملة</span>
              </div>
            </div>

            {/* Customer Care */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 shadow-xs flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto md:mx-0 mb-3 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#4A1D2E]">خدمة العملاء والطلبات</h4>
                <p className="text-xs text-[#6B5E62] mt-1.5 leading-relaxed">
                  متاحون يومياً للرد على استفساراتكم وتأكيد طلبات الضيافة والتوريد المباشر.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs">
                <a
                  href="tel:+966546002435"
                  className="font-mono dir-ltr font-bold text-[#682D43] text-sm"
                >
                  0546002435
                </a>
                <span className="text-[#9F6A76] text-[11px]">@halajwds</span>
              </div>
            </div>
          </div>

          {/* Interactive Google Map of Branches */}
          <div className="mt-6 sm:mt-8">
            <InteractiveBranchesMap />
          </div>
        </div>
      </section>
    </div>
  );
}
