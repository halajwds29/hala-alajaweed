import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Heart, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'من نحن | قصة حلا الأجاويد',
  description:
    'تعرف على قصة مؤسسة حلا الأجاويد للحلويات، بدايتنا في حائل، شغفنا بالضيافة السعودية الأصيلة، والتزامنا بأعلى معايير الجودة والمذاق.',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] text-[#682D43] text-xs font-bold border border-[#E7DCD0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
          <span>أصالة حائل وكرم الضيافة السعودية</span>
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#4A1D2E]">
          قصة مؤسسة «حلا الأجاويد»
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6468] leading-relaxed">
          نبتكر من قلب التراث السعودي العريق حلويات ترتقي بمناسباتكم وتليق بذائقتكم الرفيعة.
        </p>
      </div>

      {/* Story Narrative */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-10 md:p-14 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#682D43] leading-snug">
              من حائل العطاء.. حيث يبدأ معنى «الأجاويد»
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-[#6E6468] leading-relaxed text-justify">
              <p>
                تأسست <strong>مؤسسة حلا الأجاويد للحلويات</strong> في مدينة حائل الشهيرة بعراقة كرمها
                وحسن ضيافتها. بدأنا بشغف حقيقي لإعادة إحياء الحلويات الشعبية السعودية مثل كليجا حائل
                ومعمول التمر الفاخر، مع إضفاء لمسات عصرية تجمع بين النكهات التراثية وأحدث فنون صناعة
                الشوكولاتة البلجيكية والبقلاوة الشرقية الفاخرة.
              </p>
              <p>
                استلهمنا اسمنا «الأجاويد» من طيبة أهل هذه الأرض المباركة وأصالتهم؛ فالأجاويد هم أهل
                الكرم الذين لا يرضون لضيوفهم إلا بأجود ما تجود به أيديهم. لذلك وضعنا عهداً على أنفسنا
                أن لا نستخدم إلا أفضل المكونات الطبيعية: تمور الخلاص النقية، الفستق الحلبي الأخضر
                الطازج، السمن والزيوت الطبيعية، والبهارات المنتقاة بعناية.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#682D43] text-white hover:bg-[#522234] text-xs font-bold transition-colors shadow-xs"
              >
                <span>تصفح تشكيلاتنا الفاخرة</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#EBE3D7] shadow-xs">
              <Image
                src="/images/products/maamoul-real.jpg"
                alt="حلويات حلا الأجاويد"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E7DCD0] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#682D43] border border-[#E7DCD0]">
            <Award className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-bold text-base text-[#4A1D2E]">الأصالة والإتقان</h3>
          <p className="text-xs text-[#6E6468] leading-relaxed">
            نلتزم بالوصفات التاريخية المتقنة لكليجا حائل والمعمول التراثي مع معايير جودة معاصرة لا تقبل
            المساومة.
          </p>
        </div>

        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E7DCD0] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#682D43] border border-[#E7DCD0]">
            <Heart className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-bold text-base text-[#4A1D2E]">الضيافة والكرم</h3>
          <p className="text-xs text-[#6E6468] leading-relaxed">
            نصنع كل قطعة حلا وكأنها مقدمة لضيف عزيز في منازلنا، بتغليف فاخر يليق بكرمكم في كل مناسبة.
          </p>
        </div>

        <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E7DCD0] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#682D43] border border-[#E7DCD0]">
            <CheckCircle2 className="w-6 h-6 text-[#C5A059]" />
          </div>
          <h3 className="font-bold text-base text-[#4A1D2E]">الشغف بالابتكار</h3>
          <p className="text-xs text-[#6E6468] leading-relaxed">
            نطور باستمرار تشكيلات حديثة من الشوكولاتة الكرانشي وكاسات الحلا العصرية لتناسب كافة الأذواق.
          </p>
        </div>
      </div>
    </div>
  );
}

