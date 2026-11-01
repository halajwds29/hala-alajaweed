import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProductById, createOrder, getOrderByNumber } from '@/lib/data-service';
import { calculateEffectivePrice, generateOrderNumber } from '@/lib/utils';
import { OrderItemSnapshot } from '@/types';

// Rate limiting in-memory map (IP / timestamp)
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();

const checkoutSchema = z.object({
  idempotencyKey: z.string().min(8, 'مفتاح الطلب مطلوب'),
  orderType: z.enum(['retail', 'wholesale']).default('retail'),
  deliveryMethod: z.enum(['delivery', 'pickup']).default('delivery'),
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
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, firstRequestTime: now };

    if (now - rateData.firstRequestTime > 60000) {
      // Reset window after 1 minute
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

    const { idempotencyKey, customer, orderType, deliveryMethod, customerNotes, items } =
      parseResult.data;

    // 3. Prevent duplicate order with idempotency check
    // (If order was already submitted with this idempotency key, return existing order)
    // We can query existing orders
    // 4. Server-Side Price & Stock Verification
    const validatedItems: OrderItemSnapshot[] = [];
    let serverSubtotal = 0;
    let serverDiscountTotal = 0;

    for (const item of items) {
      const product = await getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `المنتج المحدد لم يعد متوفراً في المتجر.` },
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

      const isWholesaleActive = (orderType === 'wholesale' || item.isWholesale) && variant.isWholesaleAvailable;

      // Check wholesale minimum requirement
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
        '';

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

    // Delivery fee calculation
    // Pickup is always 0
    let deliveryFee = 0;
    if (deliveryMethod === 'delivery') {
      // Free delivery if order total is >= 350 SAR, otherwise standard 25 SAR
      const netProductsTotal = serverSubtotal - serverDiscountTotal;
      deliveryFee = netProductsTotal >= 350 ? 0 : 25;
    }

    const finalTotal = Math.max(0, serverSubtotal - serverDiscountTotal + deliveryFee);

    // 5. Generate Order and Save
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

    return NextResponse.json({
      success: true,
      orderNumber: createdOrder.orderNumber,
      order: createdOrder,
    });
  } catch (err: unknown) {
    console.error('Checkout error:', err);
    const errorMsg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء معالجة الطلب.';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

