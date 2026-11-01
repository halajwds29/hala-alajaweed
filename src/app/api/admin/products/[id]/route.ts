import { NextRequest, NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await context.params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    // Support 4 or more images (up to 20 images per product)
    if (body.images && body.images.length > 20) {
      return NextResponse.json(
        { error: 'لا يمكن إضافة أكثر من 20 صورة للمنتج' },
        { status: 400 }
      );
    }

    const updated = await saveProduct({ ...body, _id: id });
    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تعديل المنتج';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const success = await deleteProduct(id);
    return NextResponse.json({ success });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل حذف المنتج';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

