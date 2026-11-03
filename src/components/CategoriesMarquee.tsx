'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoriesMarqueeProps {
  categories: Category[];
}

export default function CategoriesMarquee({ categories }: CategoriesMarqueeProps) {
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

  // Filter only active categories and show each one EXACTLY ONCE (No repeats / No clones)
  const uniqueCategories = categories.filter((cat) => cat.isActive !== false);

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Static Luxury Grid: All categories visible, elegant, completely static without movement or duplicates */}
      <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3.5 md:gap-4">
        {uniqueCategories.map((cat, idx) => {
          const imgSrc = cat.image
            ? realImageFallbackMap[cat.image] || cat.image
            : '/images/products/baklava-real.jpg';

          return (
            <Link
              key={cat._id || cat.slug || idx}
              href={`/categories/${cat.slug}`}
              dir="rtl"
              className="group w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#EBE3D7] hover:border-[#682D43] transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center transform hover:-translate-y-1 shadow-2xs select-none cursor-pointer"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 sm:mb-3 border-2 border-[#FAF6F0] group-hover:border-[#C5A059] transition-all shadow-xs group-hover:shadow-md">
                <Image
                  src={imgSrc}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 70px, 90px"
                  className="object-cover transition-transform duration-500 group-hover:scale-108"
                />
              </div>
              <h3 className="font-bold text-[11px] sm:text-xs text-[#4A1D2E] group-hover:text-[#682D43] transition-colors leading-snug text-center line-clamp-2">
                {cat.name}
              </h3>
              {cat.nameEn && (
                <span className="text-[8px] sm:text-[9px] text-[#9F6A76] mt-0.5 uppercase tracking-wider line-clamp-1">
                  {cat.nameEn}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
