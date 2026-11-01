'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // When path or query changes, complete the bar smoothly
    setProgress(30);
    setIsNavigating(true);

    const timer1 = setTimeout(() => {
      setProgress(85);
    }, 80);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 220);

    const timer3 = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname, searchParams]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="مؤشر تحميل الصفحة"
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#682D43] via-[#C5A059] to-[#DFBF7C] shadow-[0_0_12px_rgba(197,160,89,0.7)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'all 0.3s ease-out' : 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </div>
  );
}

