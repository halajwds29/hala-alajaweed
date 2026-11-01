import { NextRequest, NextResponse } from 'next/server';
import { getAllCategoriesAdmin, saveCategory, deleteCategory } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const categories = await getAllCategoriesAdmin();
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'اسم القسم والرابط التعريفي مطلوبان' }, { status: 400 });
    }

    const saved = await saveCategory(body);
    return NextResponse.json({ success: true, category: saved });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل حفظ القسم';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'معرف القسم مطلوب' }, { status: 400 });
    }

    const success = await deleteCategory(id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل حذف القسم';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

