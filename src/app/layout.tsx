import type { Metadata, Viewport } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';
import { getSiteSettings } from '@/lib/data-service';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#682D43',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://halajwds.com'),
  title: {
    default: 'حلا الأجاويد — نكهات أصيلة ولمسات عصرية | HALA ALAJAWEED',
    template: '%s | حلا الأجاويد',
  },
  description:
    'مؤسسة حلا الأجاويد للحلويات — اكتشف عالمًا من الحلويات الشعبية والشرقية والشوكولاتة والمعجنات وبوكسات الضيافة. بيع قطاعي وجملة مع التوصيل لكافة مدن المملكة.',
  keywords: [
    'حلا الأجاويد',
    'حلويات حائل',
    'كليجا حائل',
    'بقلاوة فستق',
    'معمول تمر خلاص',
    'شوكولاتة كرانشي',
    'حلويات شعبية',
    'حلويات شرقية',
    'بوكسات ضيافة',
    'حلويات جملة وتوريد',
    'حلويات الرياض',
  ],
  authors: [{ name: 'مؤسسة حلا الأجاويد للحلويات' }],
  creator: 'حلا الأجاويد',
  publisher: 'حلا الأجاويد',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: 'حلا الأجاويد — نكهات أصيلة ولمسات عصرية',
    description:
      'تشكيلات فاخرة من الحلويات الشعبية والشرقية والشوكولاتة والمعجنات تناسب ضيافتكم ومناسباتكم واحتياجاتكم اليومية.',
    url: 'https://halajwds.com',
    siteName: 'حلا الأجاويد',
    locale: 'ar_SA',
    type: 'website',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#231E20] font-sans antialiased selection:bg-[#C99BA4] selection:text-[#4A1D2E]">
        <CartProvider>
          <MainLayoutWrapper settings={settings}>{children}</MainLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
