import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تحديث إعدادات الموقع';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

