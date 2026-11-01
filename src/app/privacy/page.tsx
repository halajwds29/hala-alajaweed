import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | حلا الأجاويد',
  description: 'سياسة الخصوصية وحماية بيانات العملاء في متجر مؤسسة حلا الأجاويد للحلويات.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#4A1D2E]">سياسة الخصوصية</h1>
        <p className="text-xs text-[#6E6468]">مؤسسة حلا الأجاويد للحلويات — HALA ALAJAWEED</p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>تنويه:</strong> هذه السياسة خاضعة لاعتماد إدارة مؤسسة حلا الأجاويد النهائي وفق نظام
          التجارة الإلكترونية ونظام حماية البيانات الشخصية في المملكة العربية السعودية.
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#6E6468] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">1. البيانات التي نجمعها</h2>
          <p>
            عند تسجيل طلب في متجر حلا الأجاويد، نقوم بجمع البيانات الضرورية فقط لتنفيذ وتوصيل الطلب،
            وتشمل: الاسم الكامل، رقم الجوال والواتساب، المدينة، الحي، والعنوان التفصيلي، بالإضافة إلى
            أي ملاحظات يسجلها العميل.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">2. الغرض من معالجة البيانات</h2>
          <p>
            تُستخدم بياناتكم المسجلة للأغراض التالية:
          </p>
          <ul className="list-disc list-inside space-y-1 pr-2">
            <li>معالجة وتجهيز طلبات الحلويات والضيافة.</li>
            <li>التواصل عبر واتساب أو الهاتف لتأكيد مواعيد التسليم ووسيلة الدفع.</li>
            <li>تمكين العميل من متابعة حالة طلبه عبر رقم الطلب ورقم الجوال.</li>
            <li>تحسين مستوى جودة المنتجات وتجربة التسوق بالموقع.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">3. حماية وأمن البيانات</h2>
          <p>
            نطبق أعلى معايير الحماية التقنية المشفرة؛ ولا نقوم ببيع أو تأجير أو مشاركة بياناتكم
            الشخصية مع أي أطراف ثالثة لأغراض دعائية. تقتصر مشاركة بيانات العنوان ورقم الهاتف مع مندوب
            التوصيل أو شركة الشحن فقط لإيصال الطلب.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#4A1D2E]">4. حقوق العميل والتواصل</h2>
          <p>
            يحق للعميل طلب تعديل أو حذف بياناته بالتواصل المباشر مع إدارة المتجر عبر البريد الإلكتروني:{' '}
            <a href="mailto:halajwds@gmail.com" className="text-[#682D43] font-bold font-mono">
              halajwds@gmail.com
            </a>{' '}
            أو عبر الواتساب الموحد{' '}
            <span className="text-[#682D43] font-mono dir-ltr font-bold">+966 54 600 2435</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

