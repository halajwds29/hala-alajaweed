import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/mongodb';
import { checkCloudinaryConnection } from '@/lib/cloudinary';

export async function GET() {
  const [dbStatus, cloudinaryStatus] = await Promise.all([
    checkDatabaseConnection(),
    checkCloudinaryConnection(),
  ]);

  return NextResponse.json({
    database: {
      connected: dbStatus.connected,
      databaseName: dbStatus.databaseName,
      host: dbStatus.host,
      error: dbStatus.error,
    },
    cloudinary: {
      connected: cloudinaryStatus.connected,
      cloudName: cloudinaryStatus.cloudName,
      error: cloudinaryStatus.error,
    },
    timestamp: new Date().toISOString(),
  });
}

