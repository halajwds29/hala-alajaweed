'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface MobileBottomNavProps {
  whatsappNumber?: string;
}

export default function MobileBottomNav({ whatsappNumber = '+966546002435' }: MobileBottomNavProps) {
  const pathname = usePathname();
  const { totalItemsCount, setIsOpen } = useCart();
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home },
    { label: 'المنتجات', href: '/products', icon: Grid },
    { label: 'فروعنا', href: '/branches', icon: MapPin },
  ];

  return (
    <nav
      aria-label="شريط التنقل السفلي للجوال"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-lg border-t border-[#EBE3D7] px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all duration-200 active:scale-95 ${
                active ? 'text-[#682D43] font-black' : 'text-[#6E6468] hover:text-[#4A1D2E]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${active ? 'text-[#682D43]' : 'text-[#9F6A76]'}`} />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#682D43]" />
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Item with dynamic counter */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-[#682D43] transition-all duration-200 active:scale-95 relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#682D43]" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-[#231E20] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-luxury-scale">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">السلة</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${cleanPhone}?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AD%D9%84%D9%88%D9%8A%D8%A7%D8%AA%20%D8%AD%D9%84%D8%A7%20%D8%A7%D9%84%D8%A3%D8%AC%D8%A7%D9%88%D9%8A%D8%AF`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-emerald-700 transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5 fill-emerald-600" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span className="text-[10px] font-bold">واتساب</span>
        </a>
      </div>
    </nav>
  );
}

