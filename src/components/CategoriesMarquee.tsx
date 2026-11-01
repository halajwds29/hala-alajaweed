'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Category } from '@/types';

interface CategoriesMarqueeProps {
  categories: Category[];
}

export default function CategoriesMarquee({ categories }: CategoriesMarqueeProps) {
  const [nudgeOffset, setNudgeOffset] = useState(0);

  // Fallback real photography map
  const realImageFallbackMap: Record<string, string> = {
    '/images/baklava.svg': '/images/products/baklava-real.jpg',
    '/images/kleicha.svg': '/images/products/kleicha-real.jpg',
    '/images/maamoul.svg': '/images/products/maamoul-real.jpg',
    '/images/chocolate.svg': '/images/products/chocolate-real.jpg',
    '/images/cups.svg': '/images/products/cups-real.jpg',
    '/images/petit-fours.svg': '/images/products/petit-fours-real.jpg',
    '/images/savory.svg': '/images/products/savory-real.jpg',
    '/images/boxes.svg': '/images/products/boxes-real.jpg',
    '/images/hero.svg': '/images/hero-patisserie.jpg',
  };

  if (!categories || categories.length === 0) return null;

  // Repeat categories enough times so each group easily exceeds even 4K resolution screens (3840px+)
  const repeatCount = Math.max(4, Math.ceil(24 / (categories.length || 1)));
  const singleGroup = Array.from({ length: repeatCount }).flatMap(() => categories);

  const handleManualNudge = (direction: 'left' | 'right') => {
    // Smoothly shift by 220px in either direction without stopping the continuous loop
    setNudgeOffset((prev) => prev + (direction === 'right' ? 220 : -220));
  };

  const renderCard = (cat: Category, keyPrefix: string, idx: number) => {
    const imgSrc = cat.image
      ? realImageFallbackMap[cat.image] || cat.image
      : '/images/products/baklava-real.jpg';

    return (
      <Link
        key={`${keyPrefix}-${cat._id || cat.slug}-${idx}`}
        href={`/categories/${cat.slug}`}
        dir="rtl"
        className="group shrink-0 w-[130px] sm:w-[170px] bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center transform hover:-translate-y-1.5 shadow-2xs select-none cursor-pointer"
      >
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 border-2 border-[#FAF6F0] group-hover:border-[#C5A059] transition-all shadow-xs group-hover:shadow-md">
          <Image
            src={imgSrc}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 70px, 120px"
            className="object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
          />
        </div>
        <h3 className="font-bold text-[11px] sm:text-sm text-[#4A1D2E] group-hover:text-[#682D43] transition-colors leading-snug text-center line-clamp-2">
          {cat.name}
        </h3>
        {cat.nameEn && (
          <span className="text-[8px] sm:text-[9px] text-[#9F6A76] mt-0.5 sm:mt-1 uppercase tracking-wider line-clamp-1">
            {cat.nameEn}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className="relative group/marquee w-full max-w-full overflow-hidden">
      {/* Top Left Navigation Buttons */}
      <div className="hidden sm:flex items-center gap-1.5 absolute -top-12 left-0 z-20">
        <button
          type="button"
          onClick={() => handleManualNudge('right')}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#682D43] text-[#4A1D2E] hover:text-white border border-[#EBE3D7] flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
          aria-label="تحريك لليمين"
          title="تحريك لليمين"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleManualNudge('left')}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#682D43] text-[#4A1D2E] hover:text-white border border-[#EBE3D7] flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
          aria-label="تحريك لليسار"
          title="تحريك لليسار"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Visual edge gradient masks for luxury fade */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 pointer-events-none bg-gradient-to-l from-[#FAF6F0] to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 pointer-events-none bg-gradient-to-r from-[#FAF6F0] to-transparent" />

      {/* Infinite Marquee Track: NEVER STOPS, NEVER EMPTIES, NEVER OVERFLOWS */}
      <div dir="ltr" className="overflow-hidden py-3 w-full max-w-full">
        <div
          className="transition-transform duration-500 ease-out flex w-max"
          style={{ transform: `translate3d(${nudgeOffset}px, 0, 0)` }}
        >
          <div className="animate-categories-ltr flex shrink-0">
            {/* Primary Infinite Track Group */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4 pl-3 sm:pl-4">
              {singleGroup.map((cat, idx) => renderCard(cat, 'grp1', idx))}
            </div>

            {/* Seamless Identical Clone Group (creates the 100% gapless continuous loop) */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4 pl-3 sm:pl-4" aria-hidden="true">
              {singleGroup.map((cat, idx) => renderCard(cat, 'grp2', idx))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
