import React from 'react';
import type { Metadata } from 'next';
import { FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | حلا الأجاويد',
  description: 'الشروط والأحكام المنظمة للتعاملات والطلبات في متجر مؤسسة حلا الأجاويد للحلويات.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto mb-2">
          <FileText className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">الشروط والأحكام</h1>
        <p className="text-xs text-[#6E6468]">مؤسسة حلا الأجاويد للحلويات — HALA ALAJAWEED</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>تنويه قانوني:</strong> تخضع هذه الشروط والأحكام للأنظمة واللوائح المعمول بها في
          المملكة العربية السعودية، وتتطلب الاعتماد النهائي من الإدارة.
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#6E6468] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">1. مقدمة وتعريفات</h2>
          <p>
            تُعد هذه الاتفاقية عقداً ملزماً بين المستخدم ومؤسسة حلا الأجاويد للحلويات، المسجلة في
            المملكة العربية السعودية ومقرها الرئيسي مدينة حائل. استخدامك للمتجر أو إتمام أي طلب يعني
            موافقتك التامة على هذه الشروط.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">2. طبيعة المنتجات وصلاحيتها</h2>
          <p>
            جميع منتجاتنا غذائية طازجة (حلويات شعبية، بقلاوة، شوكولاتة، كاسات حلا، موالح) تُخبز
            وتُجهز بمعايير صحية عالية، ولا نستخدم أي صور تم توليدها بالذكاء الاصطناعي كصور حقيقية
            للمنتجات المباعة. الصور المعروضة تمثل الأصناف الفعلية بجودة عالية.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">3. تسجيل الطلبات والأسعار</h2>
          <p>
            الأسعار المعروضة بالريال السعودي (ر.س). يحق للمتجر تعديل الأسعار وعروض الخصومات في أي وقت،
            ولا تسري التعديلات على الطلبات المؤكدة مسبقاً. يعتبر الطلب المسجل عبر الموقع طلباً مبدئياً
            بحالة «جديد» ويتم تثبيته والتنسيق لتحصيله وتسليمه بالتواصل المباشر مع العميل.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">4. شروط طلبات الجملة والتوريد</h2>
          <p>
            تخضع أسعار الجملة للحد الأدنى المحدد للكمية لكل صنف. إذا انخفضت الكمية في السلة عن الحد
            الأدنى، يتم احتساب السعر القطاعي المعتاد.
          </p>
        </section>
      </div>
    </div>
  );
}

