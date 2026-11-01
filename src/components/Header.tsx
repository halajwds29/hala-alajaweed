'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  Phone,
  Truck,
  MapPin,
  Search,
} from 'lucide-react';
import Logo from './Logo';
import TopAnnouncementBar from './TopAnnouncementBar';
import { useCart } from '@/context/CartContext';
import { formatSAR } from '@/lib/utils';
import { SiteSettings } from '@/types';

interface HeaderProps {
  settings?: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItemsCount, total, setIsOpen } = useCart();

  const isLinkActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const rightNavLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'جميع المنتجات', href: '/products' },
    { label: 'الأقسام', href: '/#categories' },
    { label: 'طلبات الجملة', href: '/wholesale' },
  ];

  const leftNavLinks = [
    { label: 'فروعنا ومواقعنا', href: '/branches' },
    { label: 'قصة حلا الأجاويد', href: '/about' },
    { label: 'تواصل معنا', href: '/contact' },
  ];

  const allNavLinks = [...rightNavLinks, ...leftNavLinks];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6F0]/95 border-b border-[#EBE3D7]/80 backdrop-blur-md transition-all duration-300">
      {/* Top Animated Announcement Marquee Bar */}
      <TopAnnouncementBar
        announcement={settings?.announcement}
        speed={settings?.announcementSpeed}
        enabled={settings?.announcementEnabled}
        phone={settings?.phone}
      />

      {/* Main Luxury Navigation Bar with Centered Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between relative">
        {/* Desktop Right Links (RTL start) */}
        <nav className="hidden lg:flex items-center gap-6 flex-1 justify-start">
          {rightNavLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm tracking-wide transition-all duration-200 relative py-1.5 group ${
                  active
                    ? 'text-[#682D43] font-black'
                    : 'text-[#4A1D2E]/85 hover:text-[#682D43] font-medium'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#682D43] rounded-full transition-all duration-300 ${
                    active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Mobile Right: Menu Toggle */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-[#682D43] hover:bg-[#682D43]/5 rounded-xl transition-colors active:scale-95"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* CENTERED LOGO: Both Desktop & Mobile */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <Logo size="md" customSrc={settings?.logoUrl} customHeight={settings?.logoHeight} />
        </div>

        {/* Desktop Left Links & Actions (RTL end) */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
          <nav className="flex items-center gap-6">
            {leftNavLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs xl:text-sm tracking-wide transition-all duration-200 relative py-1.5 group ${
                    active
                      ? 'text-[#682D43] font-black'
                      : 'text-[#4A1D2E]/85 hover:text-[#682D43] font-medium'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#682D43] rounded-full transition-all duration-300 ${
                      active ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2.5 pr-2 border-r border-[#EBE3D7]">
            {/* Search Link */}
            <Link
              href="/products"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#682D43] hover:bg-[#682D43]/10 border border-transparent hover:border-[#EBE3D7] transition-all duration-200"
              aria-label="البحث عن منتجات"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#682D43] text-[#FAF6F0] hover:bg-[#522234] transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 group"
              aria-label="سلة المشتريات"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C5A059] text-[#231E20] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-luxury-scale">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-mono">
                {total > 0 ? formatSAR(total) : 'السلة'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Left: Search and Cart */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/products"
            className="p-2 text-[#682D43] hover:bg-[#682D43]/5 rounded-lg transition-colors"
            aria-label="بحث"
          >
            <Search className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-[#682D43] hover:bg-[#682D43]/5 rounded-lg transition-colors"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#C5A059] text-[#231E20] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Smooth Slide Transition */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EBE3D7] bg-[#FAF6F0] px-6 py-6 animate-luxury-fade shadow-xl">
          <nav className="flex flex-col gap-2.5">
            {allNavLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-2.5 px-3.5 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-[#682D43] text-white font-bold shadow-xs'
                      : 'text-[#4A1D2E] hover:bg-[#682D43]/5 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-[#EBE3D7] flex flex-col gap-3 text-xs">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 text-[#682D43] font-bold"
              >
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>متابعة حالة طلبك</span>
              </Link>
              <div className="flex items-center justify-between text-[#6E6468] pt-1">
                <span>خدمة العملاء:</span>
                <a
                  href="tel:+966546002435"
                  className="font-mono dir-ltr font-bold text-[#682D43]"
                >
                  0546002435
                </a>
              </div>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] text-[#9F6A76] pt-1 text-center"
              >
                لوحة التحكم الإدارية
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
