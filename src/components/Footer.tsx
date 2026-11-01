import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Truck,
  ExternalLink,
  Globe,
} from 'lucide-react';
import Logo from './Logo';
import { SiteSettings } from '@/types';

interface FooterProps {
  settings?: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const phone = settings?.phone || '0546002435';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = (settings?.whatsapp || '966546002435').replace(/[^0-9]/g, '');

  const socialPlatforms = [
    {
      name: 'إنستغرام',
      icon: (
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
        </svg>
      ),
      href: settings?.socialLinks?.instagram || 'https://www.instagram.com/halajwds/',
    },
    {
      name: 'تيك توك',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.41 0 .79.08 1.14.24V9.46a6.32 6.32 0 0 0-1.14-.11C5.97 9.35 3 12.33 3 15.67 3 19.02 5.97 22 9.49 22c3.52 0 6.49-2.98 6.49-6.33V9.12a8.16 8.16 0 0 0 3.61 1.06V6.69z" />
        </svg>
      ),
      href: settings?.socialLinks?.tiktok || 'https://www.tiktok.com/@halajwds',
    },
    {
      name: 'سناب شات',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.002 2.5c-3.5 0-5.8 2.4-5.8 5.3 0 .8.15 1.6.3 2.3-.5.2-.95.5-1.3.9-.35.45-.35 1.05-.08 1.5.35.5 1.1.65 1.85.62.2.6.68 1.15 1.35 1.32-1 .62-2.2 1.22-2.38 1.92-.16.66.4 1.18 1.27 1.31 1.45.21 2.42-.21 3.1-.72.52.51 1.18.77 1.84.77s1.32-.26 1.84-.77c.68.51 1.65.93 3.1.72.87-.13 1.43-.65 1.27-1.31-.18-.7-1.38-1.3-2.38-1.92.67-.17 1.15-.72 1.35-1.32.75.03 1.5-.12 1.85-.62.27-.45.27-1.05-.08-1.5-.35-.4-.8-.7-1.3-.9.15-.7.3-1.5.3-2.3 0-2.9-2.3-5.3-5.8-5.3z" />
        </svg>
      ),
      href: settings?.socialLinks?.snapchat || 'https://www.snapchat.com/add/halajwds',
    },
    {
      name: 'فيسبوك',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: settings?.socialLinks?.facebook || 'https://www.facebook.com/halajwds',
    },
    {
      name: 'إكس (تويتر)',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: settings?.socialLinks?.x || 'https://x.com/halajwds',
    },
    {
      name: 'واتساب الأعمال',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.78 14.15c-.24.67-1.39 1.29-1.92 1.37-.5.07-1.13.1-3.3-0.8-2.62-1.09-4.29-3.76-4.42-3.93-.13-.17-1.05-1.4-1.05-2.67 0-1.27.66-1.89.9-2.15.24-.26.52-.33.7-.33.17 0 .35 0 .5.01.16.01.37-.06.58.44.22.52.75 1.83.82 1.97.07.14.11.31.02.49-.09.18-.14.29-.27.45-.13.15-.28.34-.4.46-.13.13-.26.27-.11.53.15.26.67 1.11 1.44 1.8 1 .89 1.84 1.17 2.1 1.3.26.13.41.11.56-.06.15-.17.65-.76.82-1.02.17-.26.35-.22.59-.13.24.09 1.53.72 1.79.85.26.13.43.2.49.31.06.11.06.66-.18 1.33z" />
        </svg>
      ),
      href: settings?.socialLinks?.whatsapp || `https://wa.me/${cleanWhatsapp}`,
    },
  ];

  return (
    <footer className="bg-[#4A1D2E] text-[#F7F1E9] border-t-2 border-[#C5A059]/40 mt-28">
      {/* Social Platforms Bar */}
      <div className="border-b border-white/10 py-6 bg-[#3B1624]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#FAF6F0]">
            <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
            <span className="font-bold">حسابات التواصل الرسمية الموحدة:</span>
            <span className="font-mono text-[#C5A059] dir-ltr text-xs">@halajwds</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            {socialPlatforms.map((soc) => (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                title={soc.name}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#C5A059] text-[#FAF6F0] hover:text-[#231E20] border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs"
              >
                {soc.icon}
              </a>
            ))}

            {/* Quick Catalog & Linkin1 Pills */}
            <a
              href={settings?.socialLinks?.whatsappCatalog || 'https://wa.me/c/966546002435'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#C5A059] hover:bg-[#d8b56f] text-[#231E20] text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>كتالوج واتساب</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={settings?.socialLinks?.linkin1 || 'https://www.linkin1.com/halajwds'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] text-xs font-medium border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>صفحة الروابط الموحدة</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Identity Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="light" size="lg" customSrc={settings?.logoUrl} customHeight={settings?.logoHeight} />
            <p className="text-xs leading-relaxed text-[#F7F1E9]/80 text-justify pt-1">
              مؤسسة حلا الأجاويد للحلويات — علامة سعودية رائدة في صناعة وإنتاج وبيع الحلويات الشرقية
              والشعبية والشوكولاتة والمعجنات الفاخرة، تجمع بين عبق التراث وأناقة الحاضر.
            </p>
            <div className="pt-2 text-xs space-y-2 text-[#C99BA4]">
              <p>
                <strong className="text-white">المعرف الموحد:</strong> @halajwds
              </p>
              <p>
                <strong className="text-white">البريد الإلكتروني:</strong> {settings?.email || 'halajwds@gmail.com'}
              </p>
              <p className="font-mono dir-ltr text-right">
                <strong className="text-white font-sans">الجوال:</strong> {phone}
              </p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest border-b border-white/10 pb-2">
              أقسام المتجر
            </h3>
            <ul className="space-y-2.5 text-xs text-[#F7F1E9]/80">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  جميع المنتجات والتشكيلات
                </Link>
              </li>
              <li>
                <Link href="/categories/eastern-sweets-baklava" className="hover:text-white transition-colors">
                  الحلويات الشرقية والبقلاوة
                </Link>
              </li>
              <li>
                <Link href="/categories/traditional-sweets" className="hover:text-white transition-colors">
                  الحلويات الشعبية (كليجا ومعمول)
                </Link>
              </li>
              <li>
                <Link href="/categories/chocolate-crunchy" className="hover:text-white transition-colors">
                  الشوكولاتة والكرانشي
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="hover:text-white transition-colors">
                  طلبات الجملة والتوريد التجاري
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest border-b border-white/10 pb-2">
              خدمة العملاء
            </h3>
            <ul className="space-y-2.5 text-xs text-[#F7F1E9]/80">
              <li>
                <Link href="/track-order" className="hover:text-white inline-flex items-center gap-1.5 transition-colors">
                  <Truck className="w-3 h-3 text-[#C5A059]" />
                  <span>متابعة حالة الطلب</span>
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-white transition-colors">
                  فروعنا ومواقعنا
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  من نحن وقصة العلامة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  سياسة الطلبات والاسترجاع
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Locations & National Address */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold text-[#C5A059] uppercase tracking-widest border-b border-white/10 pb-2">
              المواقع والعناوين المعتمدة
            </h3>

            {/* Hail HQ */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>المقر والمصنع الرئيسي — حائل</span>
              </div>
              <p className="text-[#C99BA4] text-[11px]">
                {settings?.address || 'حي النقرة — شارع فهد العلي العريفي — المملكة العربية السعودية'}
              </p>
            </div>

            {/* Riyadh National Address */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>مركز التوريد والخدمة — الرياض</span>
                </div>
                <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded font-mono font-bold">
                  RIUJ7218
                </span>
              </div>
              <p className="text-[#C99BA4] text-[11px] leading-relaxed">
                {settings?.secondaryAddress || 'العريجاء الغربية — شارع مارية القبطية — مبنى 7218 — إضافي 4732 — الرمز البريدي 14913'}
              </p>
              <div className="pt-1">
                <a
                  href={settings?.socialLinks?.googleMapsRiyadh || "https://maps.google.com/?q=24.594875%2C46.587509"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#C5A059] hover:underline"
                >
                  <span>فتح الموقع على خرائط Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Additional Custom Addresses if added by Admin */}
            {Array.isArray(settings?.additionalAddresses) && settings.additionalAddresses.map((addr) => (
              <div key={addr.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{addr.title}</span>
                  </div>
                  {addr.mapUrl && (
                    <a
                      href={addr.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#C5A059] hover:underline inline-flex items-center gap-1"
                    >
                      <span>الخريطة</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <p className="text-[#C99BA4] text-[11px]">{addr.address}</p>
                {addr.phone && (
                  <p className="text-[#FAF6F0] text-[10px] font-mono dir-ltr text-right">{addr.phone}</p>
                )}
              </div>
            ))}

            <p className="text-[10px] text-[#C99BA4]/70 leading-relaxed">
              * روابط الحسابات مبنية على اسم المستخدم المعتمد @halajwds. رابط الخرائط يفتح إحداثيات موقع الرياض مباشرة.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal Sub-Footer */}
      <div className="border-t border-white/10 py-6 bg-[#320f1c] text-xs text-[#C99BA4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div className="space-y-1">
            <p className="font-medium text-[#FAF6F0]">
              © 2026 حلا الأجاويد للحلويات | جميع الحقوق محفوظة
            </p>
            <p className="text-[11px] text-[#C5A059] font-mono tracking-wider">
              Powered by Hala Alajaweed
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="https://halajwds.com" className="hover:text-white transition-colors">
              halajwds.com
            </a>
            <span className="text-white/20">|</span>
            <Link href="/admin/login" className="hover:text-white transition-colors text-white/40 hover:text-white/80">
              بوابة الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
