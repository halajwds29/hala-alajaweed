import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/lib/data-service';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }
    const order = await getOrderByNumber(orderNumber.trim().toUpperCase());
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching order';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

