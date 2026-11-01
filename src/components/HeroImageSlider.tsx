'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroImageSliderProps {
  images?: string[];
  alt?: string;
  autoPlayInterval?: number;
}

export default function HeroImageSlider({
  images = ['/images/hero-patisserie.jpg'],
  alt = 'حلويات حلا الأجاويد الفاخرة',
  autoPlayInterval = 4500,
}: HeroImageSliderProps) {
  // Filter valid image paths and ensure at least one fallback
  const validImages =
    Array.isArray(images) && images.length > 0
      ? images.filter((img) => typeof img === 'string' && img.trim() !== '')
      : ['/images/hero-patisserie.jpg'];

  const slideList = validImages.length > 0 ? validImages : ['/images/hero-patisserie.jpg'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slideList.length, isPaused, autoPlayInterval, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slideList.length) % slideList.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideList.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    // In RTL, swiping left to right or right to left
    if (diff > 40) {
      goToNext();
    } else if (diff < -40) {
      goToPrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-xl border border-[#EBE3D7] bg-[#FAF6F0] group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="معرض صور واجهة حلا الأجاويد"
    >
      {/* Slides with Cross-Fade & Ken Burns Zoom */}
      {slideList.map((imgSrc, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={`${imgSrc}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${alt} - صورة ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Subtle Bottom Dark Gradient for Controls Readability */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />

      {/* Slide Counter Badge (Top Right) */}
      {slideList.length > 1 && (
        <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FAF6F0] text-[11px] font-mono tracking-wider shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span>{currentIndex + 1}</span>
          <span className="opacity-50">/</span>
          <span>{slideList.length}</span>
        </div>
      )}

      {/* Navigation Arrows (Prev / Next) */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            type="button"
            aria-label="الصورة السابقة"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#682D43] text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-[#FAF6F0]" />
          </button>

          <button
            onClick={goToNext}
            type="button"
            aria-label="الصورة التالية"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-[#682D43] text-white backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-[#FAF6F0]" />
          </button>
        </>
      )}

      {/* Bottom Indicator Dots / Pills */}
      {slideList.length > 1 && (
        <div className="absolute bottom-4 inset-x-0 z-20 flex items-center justify-center gap-2">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`الانتقال إلى صورة ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? 'w-7 h-2 bg-[#C5A059] shadow-sm'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

