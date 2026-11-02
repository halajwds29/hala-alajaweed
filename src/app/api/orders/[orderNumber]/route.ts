import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber } from '@/lib/data-service';
import { checkAdminAuthApi } from '@/lib/auth';

function maskName(name: string): string {
  if (!name) return 'عميل حلا الأجاويد';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2) + '***';
  return `${parts[0].slice(0, 2)}*** ${parts[parts.length - 1]}`;
}

function maskPhone(phone: string): string {
  if (!phone) return '05********';
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 7) return '******';
  return clean.slice(0, 3) + '****' + clean.slice(-3);
}

function maskAddress(address: string): string {
  if (!address) return 'العنوان مسجل بالنظام';
  return 'العنوان مسجل ومؤكد (تم إخفاء التفاصيل الدقيقة لحماية الخصوصية)';
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: 'رقم الطلب مطلوب' }, { status: 400 });
    }

    const cleanOrderNumber = orderNumber.trim().toUpperCase();
    const order = await getOrderByNumber(cleanOrderNumber);

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    // 1. Check if requester is authenticated admin
    const isAdmin = await checkAdminAuthApi(req);
    if (isAdmin) {
      return NextResponse.json({ success: true, order, isPrivileged: true });
    }

    // 2. Check if requester is verified customer (matching phone or valid order cookie)
    const reqPhone =
      req.nextUrl.searchParams.get('phone') ||
      req.headers.get('x-customer-phone');
    const orderAccessCookie = req.cookies.get(`order_token_${cleanOrderNumber}`)?.value;

    let isOwner = false;

    if (orderAccessCookie && orderAccessCookie.length >= 16) {
      isOwner = true;
    } else if (reqPhone) {
      const cleanReq = reqPhone.replace(/[^0-9]/g, '');
      const cleanOrder = order.customer.phone.replace(/[^0-9]/g, '');
      if (cleanReq.length >= 8 && (cleanReq === cleanOrder || cleanOrder.endsWith(cleanReq) || cleanReq.endsWith(cleanOrder))) {
        isOwner = true;
      }
    }

    // If verified owner, return full order
    if (isOwner) {
      return NextResponse.json({ success: true, order, isPrivileged: true });
    }

    // 3. For public unverified queries, protect customer PII strictly (IDOR Prevention)
    const maskedOrder = {
      ...order,
      customer: {
        name: maskName(order.customer.name),
        phone: maskPhone(order.customer.phone),
        city: order.customer.city,
        district: order.customer.district,
        address: maskAddress(order.customer.address),
      },
      customerNotes: order.customerNotes ? 'ملاحظات مسجلة ومحفوظة بالطلب' : '',
      adminNotes: undefined, // never expose internal notes to public
    };

    return NextResponse.json({
      success: true,
      order: maskedOrder,
      isPrivileged: false,
      privacyNotice: 'تم إخفاء بعض البيانات الشخصية لحماية خصوصية العميل.',
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء جلب تفاصيل الطلب';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
