import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data-service';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    const promo = settings.promoPopup || {
      enabled: true,
      code: 'AJAWEED10',
      discountPercent: 10,
      title: 'كود خصم حصري للضيافة',
      description: 'استخدم كود الخصم عند تأكيد الطلب واحصل على خصم 10% فوري على إجمالي طلبك',
      minOrderAmount: 0,
    };

    return NextResponse.json({
      success: true,
      promo,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل جلب كود الخصم';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'يرجى إدخال كود الخصم' }, { status: 400 });
    }

    const settings = await getSiteSettings();
    const promo = settings.promoPopup || {
      enabled: true,
      code: 'AJAWEED10',
      discountPercent: 10,
      title: 'كود خصم حصري للضيافة',
      description: 'استخدم كود الخصم عند تأكيد الطلب واحصل على خصم 10% فوري',
      minOrderAmount: 0,
    };

    const cleanInputCode = code.trim().toUpperCase();
    const cleanConfigCode = (promo.code || 'AJAWEED10').trim().toUpperCase();

    // Support configured code or common AJAWEED10 fallback
    if (cleanInputCode === cleanConfigCode || cleanInputCode === 'AJAWEED10') {
      return NextResponse.json({
        valid: true,
        code: cleanInputCode,
        discountPercent: promo.discountPercent || 10,
        message: `تم تطبيق كود الخصم بنجاح! خصم ${promo.discountPercent || 10}% على طلبك`,
      });
    }

    return NextResponse.json({
      valid: false,
      message: 'كود الخصم المدخل غير صالح أو انتهت صلاحيته.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'فشل التحقق من كود الخصم';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

