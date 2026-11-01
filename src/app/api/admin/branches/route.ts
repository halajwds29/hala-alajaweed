import { NextRequest, NextResponse } from 'next/server';
import { getBranches, saveBranch } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const branches = await getBranches(false); // All branches including unconfirmed
  return NextResponse.json({ success: true, branches });
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.city) {
      return NextResponse.json({ error: 'اسم الفرع والمدينة مطلوبان' }, { status: 400 });
    }

    const saved = await saveBranch(body);
    return NextResponse.json({ success: true, branch: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل حفظ الفرع';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

