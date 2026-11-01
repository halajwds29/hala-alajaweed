import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'burgundy';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  customSrc?: string;
  customHeight?: number;
}

export default function Logo({
  variant = 'burgundy',
  size = 'md',
  className = '',
  customSrc,
  customHeight,
}: LogoProps) {
  const isLight = variant === 'light';
  const logoSrc = customSrc || '/images/logo.png';

  // Sizing definitions for the official emblem & typography
  const defaultHeightClass = {
    sm: 'h-8 sm:h-10 w-auto',
    md: 'h-10 sm:h-14 md:h-16 w-auto',
    lg: 'h-12 sm:h-18 md:h-20 w-auto',
  }[size];

  const dynamicStyle = customHeight
    ? { height: `${customHeight}px`, width: 'auto' }
    : undefined;

  return (
    <Link
      href="/"
      className={`inline-flex items-center transition-transform hover:scale-[1.02] group ${className}`}
      aria-label="حلا الأجاويد - الرئيسية"
    >
      {isLight ? (
        <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-2xl shadow-sm border border-[#EBE3D7] flex items-center justify-center">
          <Image
            src={logoSrc}
            alt="شعار مؤسسة حلا الأجاويد للحلويات"
            width={160}
            height={128}
            style={dynamicStyle}
            className={`${customHeight ? '' : defaultHeightClass} object-contain transition-all duration-300`}
            priority
          />
        </div>
      ) : (
        <div className="flex items-center">
          <Image
            src={logoSrc}
            alt="شعار مؤسسة حلا الأجاويد للحلويات"
            width={160}
            height={128}
            style={dynamicStyle}
            className={`${customHeight ? '' : defaultHeightClass} object-contain transition-all duration-300`}
            priority
          />
        </div>
      )}
    </Link>
  );
}
