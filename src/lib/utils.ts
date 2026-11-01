import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ProductVariant, Order } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSAR(amount: number): string {
  if (isNaN(amount)) return '0.00 ر.س';
  return `${amount.toFixed(2)} ر.س`;
}

export function formatDateAr(dateString?: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HA-${year}${month}${day}-${randomPart}`;
}

export function calculateEffectivePrice(
  variant: ProductVariant,
  isWholesale: boolean,
  quantity = 1
): {
  unitPrice: number;
  originalPrice: number;
  discountAmount: number;
  meetsWholesaleMin: boolean;
  minWholesaleQty: number;
} {
  const minWholesaleQty = variant.minWholesaleQty || 1;
  const meetsWholesaleMin = !isWholesale || quantity >= minWholesaleQty;

  if (isWholesale && variant.isWholesaleAvailable && meetsWholesaleMin) {
    const basePrice = variant.wholesalePrice > 0 ? variant.wholesalePrice : variant.retailPrice;
    let discount = 0;
    if (variant.wholesaleDiscount > 0) {
      if (variant.wholesaleDiscountType === 'percentage') {
        discount = basePrice * (variant.wholesaleDiscount / 100);
      } else {
        discount = variant.wholesaleDiscount;
      }
    }
    const finalPrice = Math.max(0, basePrice - discount);
    return {
      unitPrice: Number(finalPrice.toFixed(2)),
      originalPrice: basePrice,
      discountAmount: Number(discount.toFixed(2)),
      meetsWholesaleMin: true,
      minWholesaleQty,
    };
  }

  // Retail pricing (default)
  const basePrice = variant.retailPrice;
  let discount = 0;
  if (variant.retailDiscount > 0) {
    if (variant.retailDiscountType === 'percentage') {
      discount = basePrice * (variant.retailDiscount / 100);
    } else {
      discount = variant.retailDiscount;
    }
  }
  const finalPrice = Math.max(0, basePrice - discount);
  return {
    unitPrice: Number(finalPrice.toFixed(2)),
    originalPrice: basePrice,
    discountAmount: Number(discount.toFixed(2)),
    meetsWholesaleMin: false,
    minWholesaleQty,
  };
}

export function buildWhatsAppOrderMessage(order: Order, whatsappNumber = '966546002435'): string {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const lines: string[] = [
    `*السلام عليكم ورحمة الله وبركاته*`,
    `*طلب جديد من موقع مؤسسة حلا الأجاويد للحلويات*`,
    `----------------------------------------`,
    `*رقم الطلب:* \`${order.orderNumber}\``,
    `*اسم العميل:* ${order.customer.name}`,
    `*رقم الجوال:* ${order.customer.phone}`,
    `*المدينة:* ${order.customer.city}`,
    `*الحي:* ${order.customer.district}`,
    `*العنوان:* ${order.customer.address}`,
    `*نوع الطلب:* ${order.orderType === 'wholesale' ? 'طلب جملة' : 'طلب قطاعي'}`,
    `*طريقة الاستلام:* ${order.deliveryMethod === 'pickup' ? 'استلام من الفرع' : 'توصيل للعنوان'}`,
    `----------------------------------------`,
    `*المنتجات المطلوبة:*`,
  ];

  order.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.productName}* (${item.variantName})`,
      `   الكمية: ${item.quantity} × ${formatSAR(item.unitPrice)} = ${formatSAR(item.totalPrice)}`
    );
  });

  lines.push(
    `----------------------------------------`,
    `المجموع الفرعي: ${formatSAR(order.subtotal)}`
  );

  if (order.discountTotal > 0) {
    lines.push(`الخصم الإجمالي: -${formatSAR(order.discountTotal)}`);
  }

  if (order.deliveryFee > 0) {
    lines.push(`رسوم التوصيل: ${formatSAR(order.deliveryFee)}`);
  } else {
    lines.push(`رسوم التوصيل: مجاناً`);
  }

  lines.push(`*الإجمالي النهائي:* *${formatSAR(order.total)}*`);

  if (order.customerNotes && order.customerNotes.trim() !== '') {
    lines.push(`*ملاحظات العميل:* ${order.customerNotes}`);
  }

  lines.push(
    `----------------------------------------`,
    `أرجو تأكيد استلام الطلب وتزويدي بتفاصيل الدفع والتسليم. شاكر ومقدر لكم.`
  );

  const encodedText = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function translateStatus(status: string): { label: string; colorClass: string; bgClass: string } {
  switch (status) {
    case 'new':
      return { label: 'جديد', colorClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200' };
    case 'reviewing':
      return { label: 'قيد المراجعة', colorClass: 'text-blue-800', bgClass: 'bg-blue-50 border-blue-200' };
    case 'confirmed':
      return { label: 'مؤكد', colorClass: 'text-emerald-800', bgClass: 'bg-emerald-50 border-emerald-200' };
    case 'preparing':
      return { label: 'قيد التجهيز', colorClass: 'text-purple-800', bgClass: 'bg-purple-50 border-purple-200' };
    case 'ready':
      return { label: 'جاهز للتسليم', colorClass: 'text-cyan-800', bgClass: 'bg-cyan-50 border-cyan-200' };
    case 'delivering':
      return { label: 'قيد التوصيل', colorClass: 'text-indigo-800', bgClass: 'bg-indigo-50 border-indigo-200' };
    case 'completed':
      return { label: 'مكتمل', colorClass: 'text-green-800', bgClass: 'bg-green-50 border-green-200' };
    case 'cancelled':
      return { label: 'ملغي', colorClass: 'text-rose-800', bgClass: 'bg-rose-50 border-rose-200' };
    default:
      return { label: status, colorClass: 'text-gray-800', bgClass: 'bg-gray-50 border-gray-200' };
  }
}

