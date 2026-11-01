import { NextRequest, NextResponse } from 'next/server';
import { trackOrderByPhone } from '@/lib/data-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, orderNumber } = body;

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json(
        { error: 'يرجى إدخال رقم جوال صحيح (8 أرقام على الأقل) للاستعلام عن الطلب.' },
        { status: 400 }
      );
    }

    const result = await trackOrderByPhone(
      phone.trim(),
      orderNumber && typeof orderNumber === 'string' && orderNumber.trim() ? orderNumber.trim() : undefined
    );

    if (!result.success || !result.latestOrder) {
      return NextResponse.json({ error: result.error || 'لم يتم العثور على أي طلب مسجل بهذا الرقم.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: result.latestOrder,
      orders: result.orders || [result.latestOrder],
    });
  } catch (err: unknown) {
    console.error('Track order error:', err);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الاستعلام عن الطلب.' },
      { status: 500 }
    );
  }
}
