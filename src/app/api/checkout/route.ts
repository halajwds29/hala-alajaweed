import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getProductById,
  createOrder,
  getOrderByIdempotencyKey,
  getSiteSettings,
} from '@/lib/data-service';
import { calculateEffectivePrice, generateOrderNumber } from '@/lib/utils';
import { OrderItemSnapshot } from '@/types';

// Rate limiting in-memory map (IP / timestamp)
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();

const checkoutSchema = z.object({
  idempotencyKey: z.string().min(8, 'مفتاح الطلب مطلوب لمنع التكرار'),
  orderType: z.enum(['retail', 'wholesale']).default('retail'),
  deliveryMethod: z.enum(['delivery', 'pickup']).default('delivery'),
  promoCode: z.string().optional(),
  customer: z.object({
    name: z.string().optional().default('عميل حلا الأجاويد'),
    phone: z.string().min(8, 'يرجى إدخال رقم جوال صحيح لا يقل عن 8 أرقام').max(20, 'رقم الجوال طويل جداً'),
    city: z.string().optional().default('حائل'),
    district: z.string().optional().default('سيتم التحديد عبر التواصل'),
    address: z.string().optional().default('سيتم التحديد عبر التواصل'),
  }),
  customerNotes: z.string().max(500).optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive('الكمية يجب أن تكون 1 على الأقل'),
      isWholesale: z.boolean().default(false),
    })
  ).min(1, 'السلة فارغة'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, firstRequestTime: now };

    if (now - rateData.firstRequestTime > 60000) {
      rateData.count = 1;
      rateData.firstRequestTime = now;
      rateLimitMap.set(ip, rateData);
    } else {
      rateData.count += 1;
      rateLimitMap.set(ip, rateData);
      if (rateData.count > 15) {
        return NextResponse.json(
          { error: 'تجاوزت الحد المسموح من الطلبات. يرجى الانتظار دقيقة والمحاولة مجدداً.' },
          { status: 429 }
        );
      }
    }

    // 2. Validate input with Zod
    const body = await req.json();
    const parseResult = checkoutSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'البيانات المدخلة غير صحيحة';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      idempotencyKey,
      customer,
      orderType,
      deliveryMethod,
      promoCode,
      customerNotes,
      items,
    } = parseResult.data;

    // 3. IDEMPOTENCY CHECK (Point 4: Prevent double-click duplicates)
    const existingOrder = await getOrderByIdempotencyKey(idempotencyKey);
    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.orderNumber,
        order: existingOrder,
        isReplay: true,
      });
    }

    // 4. Fetch Dynamic Store Settings (Point 5: Alignment with Admin Settings)
    const siteSettings = await getSiteSettings();

    // Check if store is open
    if (siteSettings.isStoreOpen === false) {
      return NextResponse.json(
        { error: 'نعتذر منكم، استقبال الطلبات متوقف مؤقتاً في المتجر. يرجى المحاولة لاحقاً أو التواصل معنا عبر واتساب.' },
        { status: 400 }
      );
    }

    // 5. Server-Side Price & Stock Verification
    const validatedItems: OrderItemSnapshot[] = [];
    let serverSubtotal = 0;
    let serverDiscountTotal = 0;

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: 'أحد المنتجات المحددة في السلة لم يعد متوفراً في المتجر.' },
          { status: 400 }
        );
      }

      if (!product.isAvailable || !product.isPublished) {
        return NextResponse.json(
          { error: `المنتج «${product.name}» غير متاح للطلب حالياً.` },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant || !variant.isAvailable) {
        return NextResponse.json(
          { error: `خيار البيع لمنتج «${product.name}» غير متاح حالياً.` },
          { status: 400 }
        );
      }

      const isWholesaleActive =
        (orderType === 'wholesale' || item.isWholesale) && variant.isWholesaleAvailable;

      if (isWholesaleActive && item.quantity < variant.minWholesaleQty) {
        return NextResponse.json(
          {
            error: `المنتج «${product.name}» يتطلب طلباً أدنى قدره ${variant.minWholesaleQty} ${variant.unitName} لتطبيق سعر الجملة.`,
          },
          { status: 400 }
        );
      }

      // Calculate server price strictly
      const priceCalculation = calculateEffectivePrice(variant, isWholesaleActive, item.quantity);
      const regularLineTotal = priceCalculation.originalPrice * item.quantity;
      const effectiveLineTotal = priceCalculation.unitPrice * item.quantity;
      const discountLine = Math.max(0, regularLineTotal - effectiveLineTotal);

      serverSubtotal += regularLineTotal;
      serverDiscountTotal += discountLine;

      const primaryImg =
        product.images.find((i) => i.isPrimary)?.url ||
        product.images[0]?.url ||
        '/images/products/baklava-real.jpg';

      validatedItems.push({
        productId: product._id,
        productName: product.name,
        variantId: variant.id,
        variantName: variant.name,
        saleMethod: variant.saleMethod,
        unitName: variant.unitName,
        quantity: item.quantity,
        unitPrice: priceCalculation.unitPrice,
        regularPrice: priceCalculation.originalPrice,
        discountAmount: Number(discountLine.toFixed(2)),
        totalPrice: Number(effectiveLineTotal.toFixed(2)),
        image: primaryImg,
      });
    }

    // 6. Server-Side Promo Code Verification (Point 5)
    let promoDiscountAmount = 0;
    if (promoCode && promoCode.trim()) {
      const cleanInputCode = promoCode.trim().toUpperCase();
      const promoConfig = siteSettings.promoPopup;

      if (promoConfig && promoConfig.enabled) {
        const configuredCode = (promoConfig.code || 'AJAWEED10').trim().toUpperCase();
        if (cleanInputCode === configuredCode || cleanInputCode === 'AJAWEED10') {
          const discountPercent = promoConfig.discountPercent || 10;
          const netItemsPrice = Math.max(0, serverSubtotal - serverDiscountTotal);
          promoDiscountAmount = (netItemsPrice * discountPercent) / 100;
          serverDiscountTotal += promoDiscountAmount;
        }
      }
    }

    // 7. Dynamic Delivery Fee Calculation from Store Settings (Point 5)
    let deliveryFee = 0;
    if (deliveryMethod === 'delivery') {
      const netProductsTotal = Math.max(0, serverSubtotal - serverDiscountTotal);
      const freeThreshold =
        typeof siteSettings.freeDeliveryThreshold === 'number'
          ? siteSettings.freeDeliveryThreshold
          : 350;
      const standardDeliveryFee =
        typeof siteSettings.deliveryFee === 'number' ? siteSettings.deliveryFee : 25;

      deliveryFee = netProductsTotal >= freeThreshold ? 0 : standardDeliveryFee;
    }

    const finalTotal = Math.max(0, serverSubtotal - serverDiscountTotal + deliveryFee);

    // 8. Generate Order and Save (Point 3: Guaranteed Persistence)
    const orderNumber = generateOrderNumber();

    const createdOrder = await createOrder({
      orderNumber,
      customer,
      orderType,
      deliveryMethod,
      items: validatedItems,
      subtotal: Number(serverSubtotal.toFixed(2)),
      discountTotal: Number(serverDiscountTotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
      status: 'new',
      customerNotes: customerNotes || '',
      idempotencyKey,
    });

    const response = NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      order: createdOrder,
    });

    // 9. Set secure temporary access cookie so legitimate customer can view order details safely (Point 2)
    const isProduction = process.env.NODE_ENV === 'production';
    const accessSecret = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    response.cookies.set({
      name: `order_token_${createdOrder.orderNumber}`,
      value: accessSecret,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 3, // 3 days
    });

    return response;
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء معالجة الطلب.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
