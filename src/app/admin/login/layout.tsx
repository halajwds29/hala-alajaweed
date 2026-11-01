// Standalone layout for the admin login page.
// This file intentionally does NOT include the AdminLayout session guard
// so visiting /admin/login never triggers an infinite redirect loop.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل دخول المشرف | حلا الأجاويد',
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
