import { NextRequest, NextResponse } from 'next/server';
import { getOrders, updateOrderStatus } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';
import { OrderStatus } from '@/types';

export async function GET(req: NextRequest) {
  const isAuthed = await checkAdminAuthApi(req);
  if (!isAuthed) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status');
  const status = statusParam && statusParam !== 'all' ? (statusParam as OrderStatus) : undefined;
  const search = searchParams.get('search') || undefined;

  const orders = await getOrders({ status, search });
  return NextResponse.json({ success: true, orders });
}

export async function PUT(req: NextRequest) {
  try {
    const isAuthed = await checkAdminAuthApi(req);
    if (!isAuthed) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await req.json();
    const { orderNumber, status, adminNotes } = body;

    if (!orderNumber || !status) {
      return NextResponse.json(
        { error: 'رقم الطلب والحالة مطلوبان' },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderNumber, status as OrderStatus, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل تحديث حالة الطلب';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

