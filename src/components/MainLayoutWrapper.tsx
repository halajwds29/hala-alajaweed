'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import FloatingWhatsApp from './FloatingWhatsApp';
import PromoCouponPopup from './PromoCouponPopup';
import MobileBottomNav from './MobileBottomNav';
import RouteProgressBar from './RouteProgressBar';

import { SiteSettings } from '@/types';

interface MainLayoutWrapperProps {
  children: React.ReactNode;
  settings?: SiteSettings;
}

export default function MainLayoutWrapper({ children, settings }: MainLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 lg:pb-0">
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
      <FloatingWhatsApp phoneNumber={settings?.whatsapp || settings?.phone} />
      <PromoCouponPopup />
      <MobileBottomNav whatsappNumber={settings?.whatsapp || settings?.phone} />
    </div>
  );
}

