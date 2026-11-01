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
    <div className="flex flex-col min-h-screen pb-16 lg:pb-0 print:pb-0 print:min-h-0 print:block w-full max-w-full min-w-0 overflow-x-hidden">
      <div className="no-print print:hidden w-full max-w-full min-w-0 overflow-x-hidden">
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <Header settings={settings} />
      </div>
      <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden print:p-0 print:m-0 print:w-full">{children}</main>
      <div className="no-print print:hidden w-full max-w-full min-w-0 overflow-x-hidden">
        <Footer settings={settings} />
        <CartDrawer />
        <FloatingWhatsApp phoneNumber={settings?.whatsapp || settings?.phone} />
        <PromoCouponPopup />
        <MobileBottomNav whatsappNumber={settings?.whatsapp || settings?.phone} />
      </div>
    </div>
  );
}

