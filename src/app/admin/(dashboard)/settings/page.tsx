import React from 'react';
import { getSiteSettings } from '@/lib/data-service';
import { checkDatabaseConnection } from '@/lib/mongodb';
import { checkCloudinaryConnection } from '@/lib/cloudinary';
import AdminSettingsClient from '@/components/admin/AdminSettingsClient';

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const [settings, dbStatus, cloudStatus] = await Promise.all([
    getSiteSettings(),
    checkDatabaseConnection(),
    checkCloudinaryConnection(),
  ]);

  const initialStatus = {
    database: {
      connected: dbStatus.connected,
      databaseName: dbStatus.databaseName,
      host: dbStatus.host,
      error: dbStatus.error,
    },
    cloudinary: {
      connected: cloudStatus.connected,
      cloudName: cloudStatus.cloudName,
      error: cloudStatus.error,
    },
  };

  return <AdminSettingsClient initialSettings={settings} initialStatus={initialStatus} />;
}

