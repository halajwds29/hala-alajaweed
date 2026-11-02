import { NextRequest, NextResponse } from 'next/server';
import { getAllProductsAdmin, saveProduct } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const products = await getAllProductsAdmin();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'اسم المنتج ورابط Slug مطلوبان' },
        { status: 400 }
      );
    }

    // Support up to 25 images per product
    if (body.images && body.images.length > 25) {
      return NextResponse.json(
        { error: 'الحد الأقصى المسموح به هو 25 صورة لكل منتج' },
        { status: 400 }
      );
    }

    const created = await saveProduct(body);
    return NextResponse.json({ success: true, product: created });
  } catch (err: unknown) {
    console.error('Save product error:', err);
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ المنتج';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

