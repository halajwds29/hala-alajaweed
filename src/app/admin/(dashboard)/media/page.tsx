import React from 'react';
import type { Metadata } from 'next';
import AdminMediaLibraryClient from '@/components/admin/AdminMediaLibraryClient';

export const metadata: Metadata = {
  title: 'مكتبة الوسائط والصور | لوحة التحكم',
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return <AdminMediaLibraryClient />;
}

