'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Category } from '@/types';

interface CategoriesMarqueeProps {
  categories: Category[];
}

export default function CategoriesMarquee({ categories }: CategoriesMarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Duplicate items for continuous seamless loop
  const displayCategories = [...categories, ...categories];

  const handleManualNudge = (direction: 'left' | 'right') => {
    setIsPaused(true);
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
    setTimeout(() => setIsPaused(false), 3500);
  };

  return (
    <div className="relative group/marquee">
      {/* Top Left Navigation Buttons (matching the design in screenshot) */}
      <div className="hidden sm:flex items-center gap-1.5 absolute -top-12 left-0 z-20">
        <button
          onClick={() => handleManualNudge('right')}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#682D43] text-[#4A1D2E] hover:text-white border border-[#EBE3D7] flex items-center justify-center transition-all shadow-xs active:scale-90"
          aria-label="تحريك لليمين"
          title="تحريك لليمين"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleManualNudge('left')}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#682D43] text-[#4A1D2E] hover:text-white border border-[#EBE3D7] flex items-center justify-center transition-all shadow-xs active:scale-90"
          aria-label="تحريك لليسار"
          title="تحريك لليسار"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Visual edge gradient masks for luxury fade */}
      <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 z-10 pointer-events-none bg-gradient-to-l from-[#FAF6F0] to-transparent" />
      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 z-10 pointer-events-none bg-gradient-to-r from-[#FAF6F0] to-transparent" />

      {/* Marquee Track Container with pause-on-hover / touch */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsPaused(false), 2000);
        }}
        className="overflow-hidden py-3"
      >
        <div
          className="animate-categories-ltr flex items-stretch gap-4"
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {displayCategories.map((cat, idx) => {
            const imgSrc = cat.image
              ? realImageFallbackMap[cat.image] || cat.image
              : '/images/products/baklava-real.jpg';

            return (
              <Link
                key={`${cat._id}-${idx}`}
                href={`/categories/${cat.slug}`}
                className="group shrink-0 w-[150px] sm:w-[170px] bg-white rounded-3xl p-4 border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center transform hover:-translate-y-1.5 shadow-2xs"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-[#FAF6F0] group-hover:border-[#C5A059] transition-all shadow-xs group-hover:shadow-md">
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-[#4A1D2E] group-hover:text-[#682D43] transition-colors leading-snug text-center line-clamp-2">
                  {cat.name}
                </h3>
                {cat.nameEn && (
                  <span className="text-[9px] text-[#9F6A76] mt-1 uppercase tracking-wider line-clamp-1">
                    {cat.nameEn}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
