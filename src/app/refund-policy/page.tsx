import React from 'react';
import type { Metadata } from 'next';
import { RotateCcw, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الطلبات والاسترجاع | حلا الأجاويد',
  description: 'سياسة الإلغاء، الاستبدال، والاسترجاع لمنتجات حلا الأجاويد وفق نظام التجارة الإلكترونية السعودي.',
};

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto mb-2">
          <RotateCcw className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">
          سياسة الطلبات والاسترجاع
        </h1>
        <p className="text-xs text-[#6E6468]">مؤسسة حلا الأجاويد للحلويات — HALA ALAJAWEED</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>تنويه:</strong> تخضع هذه السياسة لأحكام نظام التجارة الإلكترونية السعودي فيما يتعلق
          بالسلع الغذائية والاستهلاكية القابلة للتلف.
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#6E6468] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">1. طبيعة المنتجات الغذائية والاسترجاع</h2>
          <p>
            نظراً لأن منتجات حلا الأجاويد تندرج تحت قائمة «الأغذية والمأكولات الطازجة المعرضة للتلف
            السريع والمصنوعة حسب طلب العميل»، فإنه طبقاً للفقرة (2) من المادة الثالثة عشرة من اللائحة
            التنفيذية لنظام التجارة الإلكترونية، لا يمكن استرجاع أو استبدال المنتجات بعد استلامها بحالة
            سليمة وذلك لحماية الصحة العامة وسلامة الغذاء.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">2. حالات التعويض وإعادة التجهيز</h2>
          <p>
            تلتزم مؤسسة حلا الأجاويد بتعويض العميل أو إعادة إرسال الصنف فوراً ودون أي رسوم إضافية في
            الحالات التالية:
          </p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li>استلام صنف خاطئ غير مطابق للطلب المسجل بالفاتورة.</li>
            <li>وجود تلف واضح بالعلب أو التغليف ناتج عن عملية الشحن والتوصيل.</li>
            <li>نقص في الكميات أو محتويات البوكسات المشكلة.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">3. تعديل أو إلغاء الطلب</h2>
          <p>
            يمكن للعميل طلب إلغاء أو تعديل تفاصيل الطلب طالما كانت حالته «جديد» أو «قيد المراجعة» وقبل
            دخول الطلب مرحلة «قيد التجهيز»، وذلك بالتواصل الفوري عبر رقم واتساب المؤسسة الموحد:
            <a href="https://wa.me/966546002435" className="text-[#682D43] font-bold font-mono mr-1">
              +966 54 600 2435
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

