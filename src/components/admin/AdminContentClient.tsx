'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Save,
  CheckCircle2,
  FileEdit,
  Loader2,
  Image as ImageIcon,
  Sliders,
  Eye,
  Gauge,
  Phone,
  MapPin,
  Share2,
  Plus,
  Trash2,
  Star,
  ExternalLink,
  Mail,
  Building,
} from 'lucide-react';
import { SiteSettings, CustomAddressItem } from '@/types';
import DeviceImageUploader from './DeviceImageUploader';
import HeroImageSlider from '../HeroImageSlider';

interface AdminContentClientProps {
  initialSettings: SiteSettings;
}

export default function AdminContentClient({ initialSettings }: AdminContentClientProps) {
  // Initialize state with solid fallbacks
  const [settings, setSettings] = useState<SiteSettings>({
    ...initialSettings,
    announcementSpeed: initialSettings.announcementSpeed || 25,
    announcementEnabled: initialSettings.announcementEnabled !== false,
    logoHeight: initialSettings.logoHeight || 60,
    logoUrl: initialSettings.logoUrl || '/images/logo.png',
    heroImages:
      Array.isArray(initialSettings.heroImages) && initialSettings.heroImages.length > 0
        ? initialSettings.heroImages
        : [initialSettings.heroImageUrl || '/images/hero-patisserie.jpg'],
    phone: initialSettings.phone || '0546002435',
    whatsapp: initialSettings.whatsapp || '0546002435',
    email: initialSettings.email || 'halajwds@gmail.com',
    address: initialSettings.address || 'حائل — حي النقرة — طريق الملك عبدالعزيز',
    secondaryAddress:
      initialSettings.secondaryAddress ||
      'الرياض — العريجاء الغربية — شارع مارية القبطية — مبنى 7218 — خدمة وتوريد المناسبات',
    additionalAddresses: Array.isArray(initialSettings.additionalAddresses)
      ? initialSettings.additionalAddresses
      : [],
    socialLinks: {
      instagram: initialSettings.socialLinks?.instagram || 'https://instagram.com/halajwds',
      x: initialSettings.socialLinks?.x || 'https://x.com/halajwds',
      tiktok: initialSettings.socialLinks?.tiktok || 'https://tiktok.com/@halajwds',
      snapchat: initialSettings.socialLinks?.snapchat || 'https://snapchat.com/add/halajwds',
      facebook: initialSettings.socialLinks?.facebook || 'https://facebook.com/halajwds',
      whatsapp: initialSettings.socialLinks?.whatsapp || 'https://wa.me/966546002435',
      whatsappCatalog:
        initialSettings.socialLinks?.whatsappCatalog || 'https://wa.me/c/966546002435',
      linkin1: initialSettings.socialLinks?.linkin1 || 'https://linkin1.com/halajwds',
      googleMapsRiyadh:
        initialSettings.socialLinks?.googleMapsRiyadh ||
        'https://maps.google.com/?q=24.594875%2C46.587509',
    },
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // New Image to add to Hero Slider
  const [newHeroImgUrl, setNewHeroImgUrl] = useState('');

  // Handle Save
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ التعديلات');
      }

      setSettings({
        ...data.settings,
        announcementSpeed: data.settings.announcementSpeed || 25,
        announcementEnabled: data.settings.announcementEnabled !== false,
        logoHeight: data.settings.logoHeight || 60,
        logoUrl: data.settings.logoUrl || '/images/logo.png',
        heroImages: Array.isArray(data.settings.heroImages) ? data.settings.heroImages : [],
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ أثناء الحفظ';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Helper to add new image to hero gallery
  const handleAddHeroImage = (url: string) => {
    if (!url || !url.trim()) return;
    const currentList = Array.isArray(settings.heroImages) ? settings.heroImages : [];
    const updated = [...currentList, url.trim()];
    setSettings({
      ...settings,
      heroImages: updated,
      heroImageUrl: updated[0] || settings.heroImageUrl,
    });
    setNewHeroImgUrl('');
  };

  // Helper to remove an image from hero gallery
  const handleRemoveHeroImage = (indexToRemove: number) => {
    const currentList = Array.isArray(settings.heroImages) ? settings.heroImages : [];
    if (currentList.length <= 1) {
      alert('يجب أن تحتوي الواجهة على صورة واحدة على الأقل');
      return;
    }
    const updated = currentList.filter((_, idx) => idx !== indexToRemove);
    setSettings({
      ...settings,
      heroImages: updated,
      heroImageUrl: updated[0] || '/images/hero-patisserie.jpg',
    });
  };

  // Helper to set image as primary (move to index 0)
  const handleSetPrimaryHeroImage = (indexToPrimary: number) => {
    const currentList = Array.isArray(settings.heroImages) ? [...settings.heroImages] : [];
    const [selected] = currentList.splice(indexToPrimary, 1);
    const updated = [selected, ...currentList];
    setSettings({
      ...settings,
      heroImages: updated,
      heroImageUrl: selected,
    });
  };

  // Helper for additional custom addresses
  const handleAddCustomAddress = () => {
    const newAddr: CustomAddressItem = {
      id: `addr-${Date.now()}`,
      title: 'فرع جديد',
      address: '',
      phone: settings.phone,
      mapUrl: '',
    };
    const current = Array.isArray(settings.additionalAddresses)
      ? settings.additionalAddresses
      : [];
    setSettings({
      ...settings,
      additionalAddresses: [...current, newAddr],
    });
  };

  const handleUpdateCustomAddress = (
    id: string,
    field: keyof CustomAddressItem,
    value: string
  ) => {
    const current = Array.isArray(settings.additionalAddresses)
      ? settings.additionalAddresses
      : [];
    const updated = current.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setSettings({ ...settings, additionalAddresses: updated });
  };

  const handleRemoveCustomAddress = (id: string) => {
    const current = Array.isArray(settings.additionalAddresses)
      ? settings.additionalAddresses
      : [];
    setSettings({
      ...settings,
      additionalAddresses: current.filter((item) => item.id !== id),
    });
  };

  const currentSpeed = settings.announcementSpeed || 25;
  const currentLogoHeight = settings.logoHeight || 60;
  const currentAnnouncement =
    settings.announcement ||
    'مؤسسة حلا الأجاويد للحلويات — فخر الضيافة السعودية الأصيلة • حائل (المقر الرئيسي) • الرياض (خدمة وتوريد) • شحن مبرد لكافة مناطق المملكة';
  const heroImagesList =
    Array.isArray(settings.heroImages) && settings.heroImages.length > 0
      ? settings.heroImages
      : [settings.heroImageUrl || '/images/hero-patisserie.jpg'];

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-5xl mx-auto pb-24">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0]">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إدارة المحتوى والهوية البصرية</h1>
          <p className="text-xs text-[#6E6468] mt-0.5">
            التحكم في صور سلايدر الواجهة، أرقام التواصل، العناوين، روابط السوشيال ميديا، الشعار، وشريط الإعلانات
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-7 py-3 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto hover:shadow-lg active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ جميع التعديلات</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-luxury-fade shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">
            تم حفظ وتحديث كافة بيانات الموقع بنجاح! تم تطبيق التغييرات فوراً على واجهات المتجر.
          </span>
        </div>
      )}

      {/* 1. HERO IMAGES MULTI-SLIDER (طلب المستخدم: إضافة أكثر من صورة للخلفية والتحكم فيها) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#C5A059]" />
              <span>معرض وسلايدر صور الواجهة الرئيسية (Hero Images Carousel)</span>
            </h2>
            <p className="text-xs text-[#6E6468] mt-0.5">
              أضف أكثر من صورة للخلفية والواجهة ليتم التبديل بينها تلقائياً وبسلاسة مع إمكانية حذف وترتيب الصور
            </p>
          </div>
          <span className="text-xs font-bold text-[#C5A059] bg-[#FAF6F0] px-3 py-1 rounded-full border border-[#E7DCD0]">
            {heroImagesList.length} صور مفعلة
          </span>
        </div>

        {/* Current Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {heroImagesList.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-[#FAF6F0] aspect-[4/3] flex flex-col justify-between shadow-xs border-[#E7DCD0] hover:border-[#682D43]"
            >
              <Image
                src={url}
                alt={`صورة واجهة ${idx + 1}`}
                fill
                className="object-cover object-center"
              />

              {/* Top Bar on Card */}
              <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between pointer-events-none">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-auto ${
                    idx === 0
                      ? 'bg-[#C5A059] text-[#231E20]'
                      : 'bg-black/60 text-white backdrop-blur-xs'
                  }`}
                >
                  {idx === 0 ? 'الرئيسية ★' : `#${idx + 1}`}
                </span>

                <button
                  type="button"
                  onClick={() => handleRemoveHeroImage(idx)}
                  className="pointer-events-auto p-1.5 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-xs transition-transform active:scale-90"
                  title="حذف هذه الصورة من السلايدر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Action: Set as Primary */}
              {idx !== 0 && (
                <div className="absolute bottom-2 inset-x-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryHeroImage(idx)}
                    className="w-full py-1.5 rounded-lg bg-black/75 hover:bg-[#682D43] text-white text-[10px] font-bold backdrop-blur-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Star className="w-3 h-3 text-[#C5A059]" />
                    <span>تعيين كأول صورة</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Hero Image Section */}
        <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-4">
          <h3 className="text-xs font-bold text-[#4A1D2E] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>إضافة صورة جديدة لسلايدر الواجهة (رفع مباشر من جهازك):</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <DeviceImageUploader
                label="اختر صورة من جهازك"
                description="صورة أفقية عريضة بجودة عالية (JPG/PNG/WebP)"
                value={newHeroImgUrl}
                onChange={(url) => {
                  setNewHeroImgUrl(url);
                  handleAddHeroImage(url);
                }}
                folder="hala_alajaweed/hero"
                aspectRatio="wide"
              />
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="block text-[11px] font-bold text-[#4A1D2E]">
                أو إضافة عبر رابط مباشر:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={newHeroImgUrl}
                  onChange={(e) => setNewHeroImgUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white focus:outline-none dir-ltr"
                />
                <button
                  type="button"
                  onClick={() => handleAddHeroImage(newHeroImgUrl)}
                  disabled={!newHeroImgUrl}
                  className="px-3 py-2 rounded-xl bg-[#682D43] text-white text-xs font-bold disabled:opacity-40"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Slider Preview */}
        <div className="space-y-2 pt-2 border-t border-[#E7DCD0]">
          <div className="flex items-center justify-between text-xs text-[#6E6468]">
            <span className="font-bold flex items-center gap-1.5 text-[#4A1D2E]">
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>معاينة حية ومباشرة لسلايدر الواجهة كما يظهر لزوار المتجر الآن:</span>
            </span>
            <span className="text-[11px] text-[#8C7D82] font-mono">
              (يتحرك تلقائياً كل 4.5 ثوانٍ مع إمكانية التبديل بالأزرار)
            </span>
          </div>

          <div className="max-w-xl mx-auto">
            <HeroImageSlider images={heroImagesList} />
          </div>
        </div>
      </div>

      {/* 2. CONTACT PHONES & ADDRESSES (طلب المستخدم: إضافة رقم التواصل والعناوين) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-3 border-b border-[#E7DCD0]">
          <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C5A059]" />
            <span>أرقام التواصل والعناوين الرسمية (Contact & Locations)</span>
          </h2>
          <p className="text-xs text-[#6E6468] mt-0.5">
            تعديل رقم هاتف المتجر، رقم واتساب، البريد الإلكتروني، وعناوين الفروع ومراكز التوزيع
          </p>
        </div>

        {/* Primary Contact Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              رقم هاتف الاتصال الموحد (Phone)
            </label>
            <input
              type="text"
              required
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="0546002435"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
            <span className="text-[10px] text-[#8C7D82] mt-0.5 block">
              يظهر في أعلى الموقع، الفوتر، وصفحة التواصل
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              رقم واتساب المباشر لخدمة العملاء
            </label>
            <input
              type="text"
              required
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+966546002435"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
            <span className="text-[10px] text-[#8C7D82] mt-0.5 block">
              يفتح محادثة واتساب الفورية عند النقر على الزر العائم
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              البريد الإلكتروني الرسمي (Email)
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="halajwds@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
            <span className="text-[10px] text-[#8C7D82] mt-0.5 block">
              يظهر في الفوتر ومراسلات المتجر الرسمية
            </span>
          </div>
        </div>

        {/* Addresses Management */}
        <div className="space-y-4 pt-3 border-t border-[#E7DCD0]">
          <h3 className="text-xs font-bold text-[#4A1D2E] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>عناوين الفروع ومراكز الخدمة المعتمدة:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hail HQ Address */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-2">
              <label className="block text-xs font-bold text-[#4A1D2E]">
                المقر والمصنع الرئيسي (حائل)
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="حائل — حي النقرة — طريق الملك عبدالعزيز..."
                className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white resize-none focus:outline-none"
              />
              <span className="text-[10px] text-[#8C7D82] block">
                عنوان المركز الرئيسي والإدارة العامة بحائل
              </span>
            </div>

            {/* Riyadh Supply & Distribution */}
            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-2">
              <label className="block text-xs font-bold text-[#4A1D2E]">
                مركز الخدمة والتوريد (الرياض)
              </label>
              <textarea
                rows={2}
                value={settings.secondaryAddress || ''}
                onChange={(e) => setSettings({ ...settings, secondaryAddress: e.target.value })}
                placeholder="الرياض — العريجاء الغربية — شارع مارية القبطية..."
                className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white resize-none focus:outline-none"
              />
              <span className="text-[10px] text-[#8C7D82] block">
                عنوان مركز التوزيع والتوريد السريع بالعاصمة الرياض
              </span>
            </div>
          </div>

          {/* Dynamic Additional Branches / Locations */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6E6468]">
                فروع وعناوين إضافية مخصصة (اختياري):
              </span>
              <button
                type="button"
                onClick={handleAddCustomAddress}
                className="px-3 py-1.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة عنوان جديد</span>
              </button>
            </div>

            {Array.isArray(settings.additionalAddresses) &&
              settings.additionalAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-white border border-[#E7DCD0] shadow-xs space-y-3 relative group"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomAddress(addr.id)}
                    className="absolute top-3 left-3 p-1.5 rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
                    title="حذف هذا العنوان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                        اسم الموقع / الفرع:
                      </label>
                      <input
                        type="text"
                        value={addr.title}
                        onChange={(e) =>
                          handleUpdateCustomAddress(addr.id, 'title', e.target.value)
                        }
                        placeholder="مثال: فرع بريدة"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E7DCD0] text-xs bg-[#FAF6F0]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                        العنوان بالتفصيل:
                      </label>
                      <input
                        type="text"
                        value={addr.address}
                        onChange={(e) =>
                          handleUpdateCustomAddress(addr.id, 'address', e.target.value)
                        }
                        placeholder="المدينة — الحي — الشارع..."
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E7DCD0] text-xs bg-[#FAF6F0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                        رقم الهاتف المباشر للفرع (اختياري):
                      </label>
                      <input
                        type="text"
                        value={addr.phone || ''}
                        onChange={(e) =>
                          handleUpdateCustomAddress(addr.id, 'phone', e.target.value)
                        }
                        placeholder="0546002435"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A1D2E] mb-1">
                        رابط خرائط Google للموقع (اختياري):
                      </label>
                      <input
                        type="url"
                        value={addr.mapUrl || ''}
                        onChange={(e) =>
                          handleUpdateCustomAddress(addr.id, 'mapUrl', e.target.value)
                        }
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3 py-1.5 rounded-lg border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 3. SOCIAL MEDIA MANAGEMENT (طلب المستخدم: التحكم في روابط السوشيال ميديا) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-3 border-b border-[#E7DCD0]">
          <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#C5A059]" />
            <span>التحكم في روابط شبكات التواصل الاجتماعي الرسمية (@halajwds)</span>
          </h2>
          <p className="text-xs text-[#6E6468] mt-0.5">
            تحكم مباشر في جميع روابط الحسابات الرسمية التي تظهر في شريط الفوتر وواجهات المتجر
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Instagram */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              حساب إنستغرام (Instagram)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.instagram || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                })
              }
              placeholder="https://instagram.com/halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* TikTok */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              حساب تيك توك (TikTok)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.tiktok || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, tiktok: e.target.value },
                })
              }
              placeholder="https://tiktok.com/@halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* Snapchat */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              حساب سناب شات (Snapchat)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.snapchat || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, snapchat: e.target.value },
                })
              }
              placeholder="https://snapchat.com/add/halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* Facebook */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              صفحة فيسبوك (Facebook)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                })
              }
              placeholder="https://facebook.com/halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* X / Twitter */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              منصة إكس (X / Twitter)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.x || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, x: e.target.value },
                })
              }
              placeholder="https://x.com/halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* WhatsApp Direct Chat */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              رابط محادثة واتساب المباشرة
            </label>
            <input
              type="url"
              value={settings.socialLinks?.whatsapp || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                })
              }
              placeholder="https://wa.me/966546002435"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* WhatsApp Catalog */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              رابط كتالوج واتساب للأعمال (Catalog)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.whatsappCatalog || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, whatsappCatalog: e.target.value },
                })
              }
              placeholder="https://wa.me/c/966546002435"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* Linkin1 / Unified Links Page */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              صفحة الروابط الموحدة (Linkin1 / Bio Link)
            </label>
            <input
              type="url"
              value={settings.socialLinks?.linkin1 || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, linkin1: e.target.value },
                })
              }
              placeholder="https://linkin1.com/halajwds"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>

          {/* Google Maps Riyadh Coordinates */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-1 sm:col-span-2">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              رابط خرائط Google لموقع الرياض
            </label>
            <input
              type="url"
              value={settings.socialLinks?.googleMapsRiyadh || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  socialLinks: { ...settings.socialLinks, googleMapsRiyadh: e.target.value },
                })
              }
              placeholder="https://maps.google.com/?q=24.594875%2C46.587509"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E7DCD0] text-xs bg-white font-mono dir-ltr text-right focus:outline-none focus:border-[#682D43]"
            />
          </div>
        </div>
      </div>

      {/* 4. TOP ANNOUNCEMENT TICKER CONTROL */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#C5A059]" />
              <span>شريط الإعلانات العلوي المتحرك (Ticker Bar)</span>
            </h2>
            <p className="text-xs text-[#6E6468] mt-0.5">
              تحكم كامل في نص الشريط، سرعة حركته من اليمين لليسار، وإظهاره أو إخفائه
            </p>
          </div>

          {/* Show / Hide Toggle */}
          <label className="inline-flex items-center gap-2.5 cursor-pointer bg-[#FAF6F0] px-3.5 py-1.5 rounded-xl border border-[#E7DCD0]">
            <input
              type="checkbox"
              checked={settings.announcementEnabled !== false}
              onChange={(e) =>
                setSettings({ ...settings, announcementEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-[#682D43] focus:ring-[#682D43] accent-[#682D43] cursor-pointer"
            />
            <span className="text-xs font-bold text-[#4A1D2E]">
              {settings.announcementEnabled !== false ? 'الشريط مفعّل ومرئي' : 'الشريط مخفي'}
            </span>
          </label>
        </div>

        {/* Announcement Text Input */}
        <div>
          <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
            محتوى ونص الشريط الإعلاني
          </label>
          <input
            type="text"
            value={settings.announcement || ''}
            onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
            placeholder="اكتب النص الإعلاني أو رسالة الترحيب التي ستتحرك في أعلى الموقع..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
          />
        </div>

        {/* Speed Slider & Controls */}
        <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#E7DCD0] space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#4A1D2E] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>سرعة حركة الشريط (مدة الدورة الكاملة بالثواني)</span>
            </label>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E7DCD0]">
              <span className="text-xs font-black font-mono text-[#682D43]">{currentSpeed}</span>
              <span className="text-[10px] text-[#6E6468]">ثانية</span>
            </div>
          </div>

          {/* Slider input */}
          <div className="space-y-1">
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={currentSpeed}
              onChange={(e) =>
                setSettings({ ...settings, announcementSpeed: Number(e.target.value) })
              }
              className="w-full h-2 bg-[#E7DCD0] rounded-lg appearance-none cursor-pointer accent-[#682D43]"
            />
            <div className="flex justify-between text-[10px] text-[#8C7D82] font-mono">
              <span>10ث (سريع جداً)</span>
              <span>25ث (متوازن قياسي)</span>
              <span>40ث (هادئ ومريح)</span>
              <span>60ث (بطيء جداً)</span>
            </div>
          </div>

          {/* Quick Speed Preset Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#6E6468]">اختيار سريع للسرعة:</span>
            {[
              { label: 'سريع (15ث)', val: 15 },
              { label: 'متوازن ومريح (25ث - موصى به)', val: 25 },
              { label: 'هادئ وفخم (40ث)', val: 40 },
              { label: 'بطيء جداً (55ث)', val: 55 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => setSettings({ ...settings, announcementSpeed: preset.val })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentSpeed === preset.val
                    ? 'bg-[#682D43] text-white shadow-xs'
                    : 'bg-white hover:bg-[#EBE3D7] text-[#4A1D2E] border border-[#E7DCD0]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive Ticker Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E6468]">
            <span className="font-bold flex items-center gap-1.5 text-[#4A1D2E]">
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>معاينة حية ومباشرة للشريط المتحرك:</span>
            </span>
            <span className="text-[11px] text-[#8C7D82]">(ضع الماوس للتوقف المؤقت)</span>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#4A1D2E]/20 bg-[#4A1D2E] text-[#F7F1E9] py-2 px-4 shadow-inner group">
            {settings.announcementEnabled === false ? (
              <div className="text-center text-xs text-[#C99BA4] py-1 italic">
                (الشريط مخفي حالياً — قم بتفعيل خيار "الشريط مفعّل ومرئي" بالأعلى لإظهاره)
              </div>
            ) : (
              <div className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
                <div
                  className="inline-flex items-center gap-8 animate-marquee-rtl group-hover:[animation-play-state:paused]"
                  style={{ animationDuration: `${currentSpeed}s` }}
                >
                  <span className="text-xs font-medium tracking-wide">
                    {currentAnnouncement}
                  </span>
                  <span className="text-[#C5A059] text-xs">◆</span>
                  <span className="text-xs font-medium tracking-wide">
                    {currentAnnouncement}
                  </span>
                  <span className="text-[#C5A059] text-xs">◆</span>
                  <span className="text-xs font-medium tracking-wide">
                    {currentAnnouncement}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. STORE LOGO & SIZE CONTROLS */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-3 border-b border-[#E7DCD0]">
          <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C5A059]" />
            <span>شعار المتجر الرسمي والتحكم في حجمه وأبعاده (Logo Controls)</span>
          </h2>
          <p className="text-xs text-[#6E6468] mt-0.5">
            ارفع شعار المتجر مباشرة من جهازك وتحكم بدقة في ارتفاع وظهور الشعار في رأس الموقع
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Logo Uploader */}
          <div className="lg:col-span-6">
            <DeviceImageUploader
              label="ملف الشعار (رفع مباشر من جهازك)"
              description="اختر ملف الشعار بصيغة PNG شفافة أو JPG بدقة عالية"
              value={settings.logoUrl || '/images/logo.png'}
              onChange={(url) => setSettings({ ...settings, logoUrl: url })}
              folder="hala_alajaweed/branding"
              aspectRatio="square"
            />
          </div>

          {/* Logo Size Control & Sliders */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#E7DCD0] space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#4A1D2E] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>ارتفاع وحجم الشعار بالبكسل (Logo Height)</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#E7DCD0]">
                  <span className="text-xs font-black font-mono text-[#682D43]">
                    {currentLogoHeight}
                  </span>
                  <span className="text-[10px] text-[#6E6468]">px</span>
                </div>
              </div>

              {/* Slider for height */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={35}
                  max={110}
                  step={1}
                  value={currentLogoHeight}
                  onChange={(e) =>
                    setSettings({ ...settings, logoHeight: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-[#E7DCD0] rounded-lg appearance-none cursor-pointer accent-[#682D43]"
                />
                <div className="flex justify-between text-[10px] text-[#8C7D82] font-mono">
                  <span>35px (صغير)</span>
                  <span>60px (متناسق قياسي)</span>
                  <span>80px (بارز)</span>
                  <span>110px (كبير جداً)</span>
                </div>
              </div>

              {/* Quick Size Preset Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#6E6468]">أحجام جاهزة:</span>
                {[
                  { label: 'صغير (45px)', val: 45 },
                  { label: 'متناسق قياسي (60px)', val: 60 },
                  { label: 'بارز وفخم (75px)', val: 75 },
                  { label: 'كبير جداً (95px)', val: 95 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setSettings({ ...settings, logoHeight: preset.val })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      currentLogoHeight === preset.val
                        ? 'bg-[#682D43] text-white shadow-xs'
                        : 'bg-white hover:bg-[#EBE3D7] text-[#4A1D2E] border border-[#E7DCD0]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Dual Background Logo Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4A1D2E] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>معاينة حية ومباشرة لحجم الشعار الفعلي ({currentLogoHeight}px):</span>
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Light background */}
                <div className="rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] p-4 flex flex-col items-center justify-center min-h-[120px]">
                  <span className="text-[10px] text-[#8C7D82] mb-2 font-mono">خلفية الموقع الفاتحة</span>
                  <div className="relative flex items-center justify-center">
                    <Image
                      src={settings.logoUrl || '/images/logo.png'}
                      alt="معاينة الشعار"
                      width={200}
                      height={currentLogoHeight}
                      style={{ height: `${currentLogoHeight}px`, width: 'auto' }}
                      className="object-contain transition-all duration-150"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Dark background */}
                <div className="rounded-xl border border-[#4A1D2E] bg-[#4A1D2E] p-4 flex flex-col items-center justify-center min-h-[120px]">
                  <span className="text-[10px] text-[#C99BA4] mb-2 font-mono">خلفية الفوتر الداكنة</span>
                  <div className="relative flex items-center justify-center">
                    <Image
                      src={settings.logoUrl || '/images/logo.png'}
                      alt="معاينة الشعار"
                      width={200}
                      height={currentLogoHeight}
                      style={{ height: `${currentLogoHeight}px`, width: 'auto' }}
                      className="object-contain transition-all duration-150 brightness-105"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. OTHER VISUAL ASSETS & TEXTS */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="pb-3 border-b border-[#E7DCD0]">
          <h2 className="text-base font-bold text-[#4A1D2E] flex items-center gap-2">
            <Building className="w-5 h-5 text-[#C5A059]" />
            <span>صور أقسام المتجر والنصوص الرسمية</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Story Image */}
          <DeviceImageUploader
            label="صورة قصة حلا الأجاويد (Story)"
            description="الصورة التي تظهر في قسم حكاية التراث والضيافة"
            value={settings.storyImageUrl || '/images/products/maamoul-real.jpg'}
            onChange={(url) => setSettings({ ...settings, storyImageUrl: url })}
            folder="hala_alajaweed/story"
            aspectRatio="square"
          />

          {/* Wholesale Section Banner */}
          <DeviceImageUploader
            label="صورة بنر الجملة والتوريد"
            description="صورة قسم توريد المناسبات والمقاهي وقطاع الأعمال"
            value={settings.wholesaleImageUrl || '/images/hero-patisserie.jpg'}
            onChange={(url) => setSettings({ ...settings, wholesaleImageUrl: url })}
            folder="hala_alajaweed/wholesale"
            aspectRatio="wide"
          />
        </div>

        {/* Hero Title and Subtitle */}
        <div className="space-y-4 pt-4 border-t border-[#E7DCD0]">
          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              العنوان الرئيسي لصفحة البداية (Hero Title)
            </label>
            <input
              type="text"
              required
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              الوصف والرسالة الترحيبية (Hero Subtitle)
            </label>
            <textarea
              rows={2}
              required
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] resize-none focus:outline-none focus:border-[#682D43]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
