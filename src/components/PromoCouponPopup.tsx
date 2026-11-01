'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Tag, Copy, Check, X, Percent } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface PromoData {
  enabled: boolean;
  code: string;
  discountPercent: number;
  title: string;
  description: string;
}

export default function PromoCouponPopup() {
  const { applyCoupon, appliedCoupon } = useCart();
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('promo_popup_dismissed') === 'true';

    // Fetch promo configuration
    fetch('/api/promo')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.promo && data.promo.enabled !== false) {
          setPromo(data.promo);
          if (!isDismissed) {
            // Trigger appearance after 2.5 seconds
            const timer = setTimeout(() => {
              setVisible(true);
            }, 2500);

            // Auto-hide after 14 seconds if not clicked
            const autoHide = setTimeout(() => {
              setVisible(false);
              setMinimized(true);
            }, 16500);

            return () => {
              clearTimeout(timer);
              clearTimeout(autoHide);
            };
          } else {
            setMinimized(true);
          }
        }
      })
      .catch(() => {
        // Fallback default promo
        if (!isDismissed) {
          setPromo({
            enabled: true,
            code: 'AJAWEED10',
            discountPercent: 10,
            title: 'كود خصم خاص بالضيافة',
            description: 'استخدم هذا الكود عند الدفع واحصل على خصم 10% فوري على طلبك',
          });
          const timer = setTimeout(() => setVisible(true), 2500);
          return () => clearTimeout(timer);
        }
      });
  }, []);

  if (!promo || !promo.enabled) {
    return null;
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      // Auto-apply to cart context
      applyCoupon(promo.code);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      applyCoupon(promo.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setMinimized(true);
    try {
      sessionStorage.setItem('promo_popup_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  return (
    <>
      {/* Floating Side Popup Card */}
      {visible && (
        <aside
          role="complementary"
          aria-label="إشعار كود الخصم الترويجي"
          className="fixed bottom-20 lg:bottom-8 right-2 sm:right-6 z-50 max-w-[calc(100%-1rem)] sm:max-w-sm bg-white/95 backdrop-blur-md rounded-3xl border-2 border-[#C5A059]/40 shadow-2xl p-4 sm:p-5 animate-luxury-scale transition-all duration-300"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 left-3 p-1.5 rounded-full text-[#6E6468] hover:text-[#682D43] hover:bg-[#FAF6F0] transition-colors"
            aria-label="إغلاق التنبيه"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#682D43] text-[#FAF6F0] flex items-center justify-center shrink-0 shadow-xs border border-[#C5A059]/30">
              <Gift className="w-5 h-5 text-[#C5A059]" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#C5A059] uppercase tracking-wider mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                <span>عرض لفترة محدودة</span>
              </div>
              <h4 className="text-sm font-bold text-[#4A1D2E] leading-snug">
                {promo.title || 'كود خصم خاص بالضيافة'}
              </h4>
              <p className="text-[11px] text-[#6B5E62] mt-1 leading-relaxed line-clamp-2">
                {promo.description ||
                  `استخدم كود الخصم واحصل على خصم ${promo.discountPercent}% فوري على مشترياتك.`}
              </p>
            </div>
          </div>

          {/* Coupon Code & Copy Action */}
          <div className="mt-4 pt-3 border-t border-[#EBE3D7] flex items-center justify-between gap-2.5">
            <div className="flex-1 bg-[#FAF6F0] border-2 border-dashed border-[#682D43]/30 rounded-xl py-2 px-3 text-center">
              <span className="text-[10px] text-[#9F6A76] block">كود الخصم:</span>
              <strong className="text-sm sm:text-base font-black font-mono tracking-wider text-[#682D43]">
                {promo.code}
              </strong>
            </div>

            <button
              onClick={handleCopyCode}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 shadow-sm ${
                copied || appliedCoupon?.code === promo.code
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#682D43] hover:bg-[#522234] text-white'
              }`}
            >
              {copied || appliedCoupon?.code === promo.code ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم النسخ ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          {/* Micro Progress Bar indicating remaining view time */}
          <div className="mt-3 w-full bg-[#FAF6F0] h-1 rounded-full overflow-hidden">
            <div className="bg-[#C5A059] h-full animate-[shrink_14s_linear_forwards] origin-right" />
          </div>
        </aside>
      )}

      {/* Minimized Floating Pill: Allows customer to re-open coupon anytime */}
      {minimized && !visible && (
        <button
          onClick={() => {
            setVisible(true);
            setMinimized(false);
          }}
          className="fixed bottom-20 lg:bottom-8 right-3 sm:right-4 z-40 bg-[#682D43] hover:bg-[#522234] text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full shadow-lg border border-[#C5A059]/40 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 animate-luxury-fade"
          title="عرض كود الخصم"
        >
          <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059] shrink-0" />
          <span>خصم {promo.discountPercent}%</span>
          <span className="font-mono bg-white/20 text-[#FAF6F0] px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">
            {promo.code}
          </span>
        </button>
      )}
    </>
  );
}

