'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, MapPin } from 'lucide-react';

interface TopAnnouncementBarProps {
  announcement?: string;
  speed?: number; // Duration in seconds (e.g. 25)
  enabled?: boolean;
  phone?: string;
}

export default function TopAnnouncementBar({
  announcement = 'مؤسسة حلا الأجاويد للحلويات — فخر الضيافة السعودية الأصيلة | حائل (المقر الرئيسي) • الرياض (خدمة وتوريد) | شحن وتوصيل لكافة مدن ومناطق المملكة',
  speed = 25,
  enabled = true,
  phone = '0546002435',
}: TopAnnouncementBarProps) {
  if (!enabled) return null;

  const validSpeed = Math.max(5, Math.min(120, speed || 25));

  // The segment to repeat
  const AnnouncementItem = () => (
    <div className="flex items-center gap-6 px-4 shrink-0 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
        <span className="font-medium text-[#FAF6F0]">{announcement}</span>
      </div>
      <span className="text-[#C5A059] font-bold">•</span>
      <div className="flex items-center gap-1.5 text-[#F7F1E9]/80 text-[10px]">
        <MapPin className="w-3 h-3 text-[#C5A059]" />
        <span>المقر والمصنع الرئيسي — حائل</span>
      </div>
      <span className="text-[#C5A059] font-bold">•</span>
      <span className="text-[#F7F1E9]/80 text-[10px]">نكهات أصيلة ولمسات عصرية</span>
      <span className="text-[#C5A059] font-bold">•</span>
    </div>
  );

  return (
    <div className="bg-[#4A1D2E] text-[#F7F1E9] text-[11px] py-2 border-b border-[#C5A059]/20 relative z-30 shadow-2xs overflow-hidden group">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Animated Marquee Container */}
        <div className="relative flex-1 overflow-hidden mask-gradient-x">
          <div
            className="animate-marquee-rtl flex items-center"
            style={{ animationDuration: `${validSpeed}s` }}
          >
            <AnnouncementItem />
            <AnnouncementItem />
            <AnnouncementItem />
            <AnnouncementItem />
          </div>
        </div>

        {/* Static Action Links (Pinned on the Left in RTL for immediate access) */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#F7F1E9]/90 shrink-0 bg-[#4A1D2E] pl-2 z-10 border-r border-white/10 pr-4">
          <Link
            href="/track-order"
            className="hover:text-[#C5A059] inline-flex items-center gap-1.5 transition-colors duration-200"
          >
            <Truck className="w-3 h-3 text-[#C5A059]" />
            <span>متابعة الطلب</span>
          </Link>
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="hover:text-[#C5A059] inline-flex items-center gap-1.5 transition-colors duration-200 font-mono dir-ltr"
          >
            <Phone className="w-3 h-3 text-[#C5A059]" />
            <span>{phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

