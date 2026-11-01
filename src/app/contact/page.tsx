'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Globe,
  Share2,
} from 'lucide-react';
import InteractiveBranchesMap from '@/components/InteractiveBranchesMap';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: 'استفسار عام',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/settings/public')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching settings for contact page:', err));
  }, []);

  const phone = siteSettings?.phone || '0546002435';
  const whatsapp = siteSettings?.whatsapp || '0546002435';
  const email = siteSettings?.email || 'halajwds@gmail.com';
  const address = siteSettings?.address || 'حائل — حي النقرة — طريق الملك عبدالعزيز';
  const secondaryAddress = siteSettings?.secondaryAddress || 'الرياض — العريجاء الغربية — شارع مارية القبطية — مبنى 7218';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) return;

    // Build direct WhatsApp pre-filled message URL
    const text = encodeURIComponent(
      `*رسالة جديدة من موقع حلا الأجاويد*\n` +
      `*الاسم:* ${formData.name}\n` +
      `*الجوال:* ${formData.phone}\n` +
      `*الموضوع:* ${formData.subject}\n` +
      `*الرسالة:* ${formData.message}`
    );

    window.open(`https://wa.me/${cleanWhatsapp || '966546002435'}?text=${text}`, '_blank');
    setSubmitted(true);
  };

  const socialLinks = [
    { name: 'الموقع الإلكتروني', handle: 'halajwds.com', href: 'https://halajwds.com' },
    { name: 'إنستغرام', handle: '@halajwds', href: siteSettings?.socialLinks?.instagram || 'https://www.instagram.com/halajwds/' },
    { name: 'تيك توك', handle: '@halajwds', href: siteSettings?.socialLinks?.tiktok || 'https://www.tiktok.com/@halajwds' },
    { name: 'سناب شات', handle: '@halajwds', href: siteSettings?.socialLinks?.snapchat || 'https://www.snapchat.com/add/halajwds' },
    { name: 'فيسبوك', handle: 'halajwds', href: siteSettings?.socialLinks?.facebook || 'https://www.facebook.com/halajwds' },
    { name: 'إكس (تويتر)', handle: '@halajwds', href: siteSettings?.socialLinks?.x || 'https://x.com/halajwds' },
    { name: 'واتساب الأعمال', handle: phone, href: siteSettings?.socialLinks?.whatsapp || `https://wa.me/${cleanWhatsapp || '966546002435'}` },
    { name: 'كتالوج واتساب', handle: 'عرض المنتجات', href: siteSettings?.socialLinks?.whatsappCatalog || 'https://wa.me/c/966546002435' },
    { name: 'صفحة الروابط الموحدة', handle: 'linkin1.com/halajwds', href: siteSettings?.socialLinks?.linkin1 || 'https://www.linkin1.com/halajwds' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-luxury-fade">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold text-[#9F6A76] tracking-widest uppercase">
          خدمة العملاء والضيافة
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A1D2E] font-serif">
          تواصل مع حلا الأجاويد
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E62]">
          فريقنا في خدمتكم للإجابة على استفساراتكم، واستقبال طلبات الضيافة والتوريد لكافة مدن المملكة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Locations (Right) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Box */}
          <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-3 border-b border-[#EBE3D7]">
              بيانات التواصل المباشرة
            </h2>

            <div className="space-y-4 text-xs text-[#6B5E62]">
              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#4A1D2E] block text-sm">الهاتف والجوال الموحد:</strong>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#682D43] font-mono dir-ltr font-bold text-sm block text-right">
                    {phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#682D43]/10 text-[#682D43] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#4A1D2E] block text-sm">البريد الإلكتروني:</strong>
                  <a href={`mailto:${email}`} className="hover:text-[#682D43] font-mono text-sm block">
                    {email}
                  </a>
                </div>
              </div>

              {/* WhatsApp Business */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-[#4A1D2E] block text-sm">واتساب الأعمال:</strong>
                  <a
                    href={siteSettings?.socialLinks?.whatsapp || `https://wa.me/${cleanWhatsapp || '966546002435'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold block"
                  >
                    محادثة مباشرة لخدمة العملاء والطلبات
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] text-[#C5A059] flex items-center justify-center shrink-0 border border-[#EBE3D7]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-[#4A1D2E] block text-sm">ساعات العمل:</strong>
                  <span>يومياً: من 9:00 صباحاً حتى 11:30 مساءً (الجمعة بعد الصلاة)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hail Headquarters Card */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#EBE3D7] p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-[#682D43] font-bold text-sm">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>المقر والمصنع الرئيسي — حائل</span>
            </div>
            <p className="text-xs text-[#6B5E62] leading-relaxed">
              {address}
            </p>
          </div>

          {/* Riyadh National Address Card */}
          <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EBE3D7]">
              <div className="flex items-center gap-2 text-[#682D43] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>مركز الخدمة والتوريد — الرياض</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[#FAF6F0] text-[#682D43] font-mono font-bold border border-[#EBE3D7]">
                RIUJ7218
              </span>
            </div>
            <p className="text-xs text-[#6B5E62] leading-relaxed">
              {secondaryAddress}
            </p>

            {/* Address Details Table */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">المدينة:</span>
                <span className="font-bold text-[#4A1D2E]">الرياض</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">الحي:</span>
                <span className="font-bold text-[#4A1D2E]">العريجاء الغربية</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">الشارع:</span>
                <span className="font-bold text-[#4A1D2E]">مارية القبطية</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">رقم المبنى:</span>
                <span className="font-bold text-[#4A1D2E] font-mono">7218</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">الرقم الإضافي:</span>
                <span className="font-bold text-[#4A1D2E] font-mono">4732</span>
              </div>
              <div className="p-2 rounded-xl bg-[#FAF6F0]">
                <span className="text-[#9F6A76] block text-[10px]">الرمز البريدي:</span>
                <span className="font-bold text-[#4A1D2E] font-mono">14913</span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=24.594875%2C46.587509"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full gap-2 py-2.5 px-4 rounded-xl bg-[#682D43] text-[#FAF6F0] hover:bg-[#522234] text-xs font-bold transition-all shadow-xs"
            >
              <span>فتح الموقع على خرائط Google</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <p className="text-[10px] text-[#9F6A76] leading-relaxed">
              * رابط خرائط Google يفتح إحداثيات موقع الرياض مباشرة.
            </p>
          </div>
        </div>

        {/* Message Form & Social Channels (Left) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Message Form */}
          <div className="bg-white rounded-3xl border border-[#EBE3D7] p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-3 border-b border-[#EBE3D7]">
              إرسال استفسار أو طلب توريد
            </h2>

            {submitted ? (
              <div className="p-8 text-center bg-[#FAF6F0] rounded-2xl border border-[#EBE3D7] space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-[#4A1D2E]">شكراً لتواصلكم الكريم</h3>
                <p className="text-xs text-[#6B5E62]">
                  تم تجهيز رسالتكم ونقلها لواتساب المؤسسة لسرعة الرد والمتابعة.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-[#682D43] text-white rounded-full text-xs font-bold"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                      الاسم الكريم <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="محمد العبدالله"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D7] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                      رقم الجوال والواتساب <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="0546002435"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D7] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0] font-mono text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                    الموضوع أو نوع الطلب
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D7] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0] font-medium"
                  >
                    <option value="استفسار عام عن الحلويات">استفسار عام عن الحلويات</option>
                    <option value="طلب تسعيرة جملة للمقاهي والفنادق">طلب تسعيرة جملة للمقاهي والفنادق</option>
                    <option value="تجهيز صواني وبوكسات مناسبات وأفراح">تجهيز صواني وبوكسات مناسبات وأفراح</option>
                    <option value="متابعة حالة شحنة سابقة">متابعة حالة شحنة سابقة</option>
                    <option value="اقتراح أو ملاحظة">اقتراح أو ملاحظة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                    نص الرسالة أو تفاصيل الطلب <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="اكتب هنا استفسارك أو تفاصيل مناسبتك والكميات المطلوبة..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE3D7] focus:outline-none focus:border-[#682D43] text-xs bg-[#FAF6F0] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال وتأكيد عبر واتساب</span>
                </button>
              </form>
            )}
          </div>

          {/* Digital Channels & Social Platforms Matrix */}
          <div className="bg-[#FAF6F0] rounded-3xl border border-[#EBE3D7] p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE3D7]">
              <div>
                <h3 className="font-bold text-sm text-[#4A1D2E]">
                  المنصات الرقمية وروابط التواصل المعتمدة
                </h3>
                <span className="text-[11px] text-[#9F6A76]">
                  اسم المستخدم الموحد: @halajwds
                </span>
              </div>
              <Share2 className="w-4 h-4 text-[#C5A059]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white hover:bg-white/80 border border-[#EBE3D7] hover:border-[#682D43] flex items-center justify-between transition-all group"
                >
                  <div>
                    <span className="text-xs font-bold text-[#4A1D2E] group-hover:text-[#682D43] block">
                      {link.name}
                    </span>
                    <span className="text-[10px] text-[#9F6A76] font-mono dir-ltr block text-right">
                      {link.handle}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A059] opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>

            <p className="text-[10px] text-[#9F6A76] pt-1">
              * روابط الحسابات مبنية على اسم المستخدم المعتمد @halajwds لمؤسسة حلا الأجاويد للحلويات.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Google Maps Section */}
      <InteractiveBranchesMap />
    </div>
  );
}
