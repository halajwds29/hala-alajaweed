import React from 'react';
import { getSiteSettings } from '@/lib/data-service';
import AdminContentClient from '@/components/admin/AdminContentClient';

export const revalidate = 0;

export default async function AdminContentPage() {
  const settings = await getSiteSettings();
  return <AdminContentClient initialSettings={settings} />;
}

