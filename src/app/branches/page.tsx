import React from 'react';
import type { Metadata } from 'next';
import { Store, MapPin, Phone, Clock, Truck, ExternalLink, ShieldCheck } from 'lucide-react';
import { getBranches } from '@/lib/data-service';
import InteractiveBranchesMap from '@/components/InteractiveBranchesMap';

export const metadata: Metadata = {
  title: 'فروعنا ومواقعنا | حلا الأجاويد',
  description:
    'تعرف على مقر مؤسسة حلا الأجاويد للحلويات في حائل بحي النقرة، والعنوان الوطني بالرياض، ونطاق الشحن والتوصيل لكافة مدن المملكة.',
};

export const revalidate = 60;

export default async function BranchesPage() {
  const branches = await getBranches(true);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-luxury-fade">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
          شبكة الفروع والمواقع
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A1D2E] font-serif">
          فروع حلا الأجاويد ومناطق التوصيل
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E62]">
          مقرنا الأساسي في حائل، وخدماتنا وعناويننا تمتد للرياض وكافة أنحاء المملكة عبر شبكة شحن وتوزيع متكاملة.
        </p>
      </div>

      {/* Interactive Google Map Section */}
      <InteractiveBranchesMap />

      {/* Main Official Branches & National Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hail HQ */}
        <div className="bg-white rounded-3xl border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bg-[#682D43] text-[#FAF6F0] text-[10px] font-bold px-4 py-1.5 rounded-br-2xl shadow-xs">
            المقر والمصنع الرئيسي
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#682D43] border border-[#EBE3D7]">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#4A1D2E]">الفرع والمقر الرئيسي — حائل</h2>
                <p className="text-xs text-[#9F6A76]">حي النقرة — شارع فهد العلي العريفي</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#6B5E62] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>شارع فهد العلي العريفي — حي النقرة — حائل — المملكة العربية السعودية</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>يومياً: من 9:00 صباحاً حتى 11:30 مساءً (الجمعة بعد الصلاة)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:+966546002435" className="hover:text-[#682D43] font-mono dir-ltr font-bold">
                  0546002435
                </a>
              </div>
            </div>

            {/* Service Areas */}
            <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7] space-y-1">
              <span className="text-xs font-bold text-[#4A1D2E] block">
                نطاق التوصيل السريع المحلي:
              </span>
              <p className="text-[11px] text-[#6B5E62]">
                مدينة حائل، بقعاء، الغزالة، الشنان، وكافة محافظات وقرى منطقة حائل
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EBE3D7] flex gap-3 mt-6">
            <a
              href="tel:+966546002435"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold text-center border border-[#EBE3D7] transition-all"
            >
              اتصال هاتفي
            </a>
            <a
              href="https://maps.google.com/?q=Hail+AlNaqrah"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>فتح الموقع بالخرائط</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Riyadh Location & National Address */}
        <div className="bg-white rounded-3xl border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 p-6 sm:p-8 shadow-xs flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 bg-[#C5A059] text-[#231E20] text-[10px] font-bold px-4 py-1.5 rounded-br-2xl shadow-xs">
            العنوان الوطني والتوريد
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] flex items-center justify-center text-[#682D43] border border-[#EBE3D7]">
                <MapPin className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#4A1D2E]">موقع الرياض (العنوان الوطني)</h2>
                <p className="text-xs text-[#9F6A76]">حي العريجاء الغربية — شارع مارية القبطية</p>
              </div>
            </div>

            {/* National Address Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">المدينة:</span>
                <span className="font-bold text-[#4A1D2E]">الرياض</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">الحي:</span>
                <span className="font-bold text-[#4A1D2E]">العريجاء الغربية</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">الشارع:</span>
                <span className="font-bold text-[#4A1D2E]">مارية القبطية</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">رقم المبنى:</span>
                <span className="font-bold text-[#4A1D2E] font-mono">7218</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">الرقم الإضافي:</span>
                <span className="font-bold text-[#4A1D2E] font-mono">4732</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE3D7]">
                <span className="text-[#9F6A76] block text-[10px]">العنوان المختصر:</span>
                <span className="font-bold text-[#682D43] font-mono">RIUJ7218</span>
              </div>
            </div>

            {/* Notes */}
            <p className="text-[11px] text-[#6B5E62] leading-relaxed">
              * متاح للتنسيق المسبق وطلبات التوريد والجملة والمناسبات في منطقة الرياض ومحافظاتها.
            </p>
          </div>

          <div className="pt-6 border-t border-[#EBE3D7] flex gap-3 mt-6">
            <a
              href="https://wa.me/966546002435?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AA%D9%86%D8%B3%D9%8A%D9%82%20%D9%84%D8%B7%D9%84%D8%A8%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%AF"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold text-center border border-[#EBE3D7] transition-all"
            >
              تنسيق عبر واتساب
            </a>
            <a
              href="https://maps.google.com/?q=24.594875%2C46.587509"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>فتح موقع الرياض بالخرائط</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Kingdom-wide Shipping Notice */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#EBE3D7] flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center shrink-0">
          <Truck className="w-8 h-8 text-[#682D43]" />
        </div>
        <div className="flex-1 text-center sm:text-right space-y-1">
          <h3 className="font-bold text-base text-[#4A1D2E]">الشحن والتوصيل لكافة مدن المملكة</h3>
          <p className="text-xs text-[#6B5E62] leading-relaxed">
            نعتمد شركاء شحن وتوصيل مبرد وسريع لضمان وصول أصناف الكليجا والبقلاوة والشوكولاتة طازجة
            ومحفوظة بجودتها الأصلية إلى باب منزلك أو مقرك في أي مدينة سعودية.
          </p>
        </div>
      </div>
    </div>
  );
}
