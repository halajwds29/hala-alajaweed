'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ExternalLink,
  Store,
  CheckCircle2,
} from 'lucide-react';

interface BranchLocation {
  id: string;
  name: string;
  badge: string;
  isHQ: boolean;
  city: string;
  district: string;
  street: string;
  buildingNumber?: string;
  additionalNumber?: string;
  postalCode?: string;
  shortAddress?: string;
  fullAddress: string;
  phone: string;
  workingHours: string;
  embedUrl: string;
  navigationUrl: string;
}

const branchesData: BranchLocation[] = [
  {
    id: 'hail',
    name: 'المقر والمصنع الرئيسي — حائل',
    badge: 'المقر الرئيسي المعتمد',
    isHQ: true,
    city: 'حائل',
    district: 'حي النقرة',
    street: 'شارع فهد العلي العريفي',
    fullAddress: 'شارع فهد العلي العريفي — حي النقرة — حائل — المملكة العربية السعودية',
    phone: '0546002435',
    workingHours: 'يومياً: من 9:00 صباحاً حتى 11:30 مساءً (الجمعة بعد الصلاة)',
    embedUrl:
      'https://maps.google.com/maps?q=27.4933,41.6882&t=&z=15&ie=UTF8&iwloc=&output=embed',
    navigationUrl: 'https://maps.google.com/?q=27.4933,41.6882',
  },
  {
    id: 'riyadh',
    name: 'موقع الرياض (العنوان الوطني والتوريد)',
    badge: 'العنوان الوطني RIUJ7218',
    isHQ: false,
    city: 'الرياض',
    district: 'العريجاء الغربية',
    street: 'شارع مارية القبطية',
    buildingNumber: '7218',
    additionalNumber: '4732',
    postalCode: '14913',
    shortAddress: 'RIUJ7218',
    fullAddress:
      'شارع مارية القبطية — مبنى 7218 — إضافي 4732 — الرمز البريدي 14913 — العنوان المختصر RIUJ7218',
    phone: '0546002435',
    workingHours: 'متاح للتنسيق المسبق وطلبات التوريد والجملة وخدمة العملاء',
    embedUrl:
      'https://maps.google.com/maps?q=24.594875,46.587509&t=&z=16&ie=UTF8&iwloc=&output=embed',
    navigationUrl: 'https://maps.google.com/?q=24.594875%2C46.587509',
  },
];

interface InteractiveBranchesMapProps {
  initialBranchId?: 'hail' | 'riyadh';
  compact?: boolean;
}

export default function InteractiveBranchesMap({
  initialBranchId = 'hail',
  compact = false,
}: InteractiveBranchesMapProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId);

  const activeBranch =
    branchesData.find((b) => b.id === selectedBranchId) || branchesData[0];

  return (
    <div className="bg-white rounded-3xl border border-[#EBE3D7] p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#EBE3D7]">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#9F6A76] tracking-widest uppercase">
            الخرائط التفاعلية المباشرة
          </span>
          <h3 className="text-lg sm:text-2xl font-black text-[#4A1D2E] font-serif mt-0.5">
            مواقع حلا الأجاويد على خريطة Google
          </h3>
          <p className="text-xs text-[#6B5E62] mt-1">
            اختر الموقع لمعاينته تفاعلياً على الخريطة والوصول إلى مسار الملاحة والعنوان الدقيق
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7] self-stretch sm:self-start md:self-auto overflow-x-auto">
          {branchesData.map((branch) => {
            const isSelected = branch.id === selectedBranchId;
            return (
              <button
                key={branch.id}
                onClick={() => setSelectedBranchId(branch.id)}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#682D43] text-[#FAF6F0] shadow-sm'
                    : 'text-[#4A1D2E] hover:bg-[#682D43]/5'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C5A059]' : 'text-[#9F6A76]'}`} />
                <span>{branch.city === 'حائل' ? 'مقر حائل الرئيسي' : 'موقع الرياض'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: Map + Active Branch Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
        {/* Interactive Google Map Frame */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[#EBE3D7] shadow-inner bg-[#FAF6F0] relative min-h-[280px] sm:min-h-[420px]">
          <iframe
            key={activeBranch.id}
            src={activeBranch.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '280px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`خريطة ${activeBranch.name}`}
            className="w-full h-full rounded-2xl transition-opacity duration-500"
          />

          {/* Quick Floating Pill on Map */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#EBE3D7] shadow-sm flex items-center gap-1.5 sm:gap-2 pointer-events-none text-[10px] sm:text-xs font-bold text-[#4A1D2E]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>خريطة تفاعلية مباشرة — {activeBranch.city}</span>
          </div>
        </div>

        {/* Active Branch Info Column */}
        <div className="lg:col-span-4 bg-[#FAF6F0] rounded-2xl border border-[#EBE3D7] p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-white text-[#682D43] border border-[#EBE3D7]">
                {activeBranch.badge}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-[#4A1D2E] mt-2 leading-snug">
                {activeBranch.name}
              </h4>
              <p className="text-xs text-[#9F6A76] mt-0.5">
                {activeBranch.city} — {activeBranch.district}
              </p>
            </div>

            {/* Address Details */}
            <div className="space-y-2.5 text-xs text-[#6B5E62] pt-2 border-t border-[#EBE3D7]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeBranch.fullAddress}</span>
              </div>

              {activeBranch.shortAddress && (
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE3D7] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#9F6A76] block text-[9px]">العنوان المختصر:</span>
                    <strong className="text-[#682D43] font-mono">{activeBranch.shortAddress}</strong>
                  </div>
                  <div>
                    <span className="text-[#9F6A76] block text-[9px]">الرمز البريدي:</span>
                    <strong className="text-[#4A1D2E] font-mono">{activeBranch.postalCode}</strong>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{activeBranch.workingHours}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a
                  href={`tel:${activeBranch.phone}`}
                  className="font-mono dir-ltr font-bold text-[#682D43] hover:underline"
                >
                  {activeBranch.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="space-y-2 pt-4 border-t border-[#EBE3D7]">
            <a
              href={activeBranch.navigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#682D43] hover:bg-[#522234] text-[#FAF6F0] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-[#C5A059]" />
              <span>فتح مسار الملاحة والاتجاهات بالخرائط</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://wa.me/966546002435?text=${encodeURIComponent(
                `السلام عليكم، أود الاستفسار عن الوصول إلى ${activeBranch.name}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#4A1D2E] text-xs font-bold transition-all border border-[#EBE3D7] flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>تنسيق الوصول عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

