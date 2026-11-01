import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  clearAdminSession(response);
  return response;
}

