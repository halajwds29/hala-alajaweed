import {
  calculateEffectivePrice,
  generateOrderNumber,
  buildWhatsAppOrderMessage,
  formatSAR,
  translateStatus,
} from '../utils';
import {
  getProducts,
  getProductBySlug,
  getCategories,
  createOrder,
  getOrderByNumber,
  trackOrder,
  updateOrderStatus,
  getDashboardStats,
  saveProduct,
  deleteProduct,
  saveCategory,
  saveBranch,
  getBranches,
} from '../data-service';
import { ProductVariant } from '@/types';

async function runAcceptanceTests() {
  console.log('=== بدء اختبارات القبول الشاملة لمتجر حلا الأجاويد ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [نجاح]: ${testName}`);
      passed++;
    } else {
      console.error(`✗ [فشل]: ${testName}`);
      failed++;
    }
  }

  // 1. اختبار التصنيفات
  const categories = await getCategories();
  assert(categories.length >= 7, 'جلب التصنيفات السبعة الأساسية بنجاح');
  const catSlugs = categories.map((c) => c.slug);
  assert(
    catSlugs.includes('eastern-sweets-baklava') &&
    catSlugs.includes('traditional-sweets') &&
    catSlugs.includes('chocolate-crunchy'),
    'تأكيد وجود تصنيفات البقلاوة والحلويات الشعبية والشوكولاتة'
  );

  // 2. اختبار المنتجات وخيارات البيع
  const products = await getProducts();
  assert(products.length >= 8, 'جلب قائمة المنتجات بنجاح');

  const baklava = await getProductBySlug('royal-pistachio-baklava');
  assert(!!baklava, 'جلب تفاصيل منتج البقلاوة بالـ Slug');
  assert((baklava?.variants.length ?? 0) >= 4, 'تأكيد وجود 4 خيارات بيع للبقلاوة (قطعة، علبة، وزن، كيلو)');
  assert(baklava?.calories === 420, 'عرض السعرات الحرارية الصحيحة (420 سعرة)');

  // 3. اختبار طرق البيع الأربعة
  const pieceVariant = baklava?.variants.find((v) => v.saleMethod === 'piece');
  const boxVariant = baklava?.variants.find((v) => v.saleMethod === 'box');
  const weightVariant = baklava?.variants.find((v) => v.saleMethod === 'weight');
  assert(!!pieceVariant, 'دعم خيار البيع بالقطعة');
  assert(!!boxVariant, 'دعم خيار البيع بالعلبة');
  assert(!!weightVariant, 'دعم خيار البيع بالوزن');

  // 4. اختبار حساب أسعار القطاعي والجملة والخصومات
  if (boxVariant) {
    // Retail pricing
    const retailCalc = calculateEffectivePrice(boxVariant, false, 2);
    assert(retailCalc.originalPrice === 65, 'السعر الأصلي للعلبة 65 ر.س');
    assert(retailCalc.discountAmount === 5, 'قيمة خصم القطاعي 5 ر.س');
    assert(retailCalc.unitPrice === 60, 'سعر الوحدة بعد الخصم 60 ر.س');

    // Wholesale pricing below min
    const wsBelowMin = calculateEffectivePrice(boxVariant, true, 5);
    assert(!wsBelowMin.meetsWholesaleMin, 'عدم تطبيق سعر الجملة عند كمية أقل من الحد الأدنى (10)');

    // Wholesale pricing meeting min
    const wsMeetsMin = calculateEffectivePrice(boxVariant, true, 12);
    assert(wsMeetsMin.meetsWholesaleMin, 'تطبيق سعر الجملة عند استيفاء الحد الأدنى');
    assert(wsMeetsMin.unitPrice === 48, 'سعر الجملة للعلبة 48 ر.س');
  }

  // 5. اختبار إنشاء وتثبيت الطلب في قاعدة البيانات (Order Snapshot)
  const testOrderNumber = generateOrderNumber();
  assert(testOrderNumber.startsWith('HA-'), 'توليد رقم طلب فريد يبدأ بـ HA-');

  const sampleOrder = await createOrder({
    orderNumber: testOrderNumber,
    customer: {
      name: 'عبدالله الشمري',
      phone: '0546002435',
      city: 'حائل',
      district: 'حي النقرة',
      address: 'شارع فهد العلي العريفي — مبنى 14',
    },
    orderType: 'retail',
    deliveryMethod: 'delivery',
    items: [
      {
        productId: 'prod-1',
        productName: 'بقلاوة الأجاويد الملكية بالفستق الحلبي',
        variantId: 'var-1-2',
        variantName: 'علبة ضيافة (12 قطعة)',
        saleMethod: 'box',
        unitName: 'علبة',
        quantity: 2,
        unitPrice: 60,
        regularPrice: 65,
        discountAmount: 10,
        totalPrice: 120,
        image: 'https://images.unsplash.com/photo-1598233847372-520e541434c4',
      },
    ],
    subtotal: 130,
    discountTotal: 10,
    deliveryFee: 25,
    total: 145,
    customerNotes: 'يرجى التوصيل بعد صلاة العصر مع كرت إهداء',
  });

  assert(sampleOrder.orderNumber === testOrderNumber, 'حفظ الطلب بنجاح في قاعدة البيانات');
  assert(sampleOrder.status === 'new', 'الحالة المبدئية للطلب هي «جديد»');
  assert(sampleOrder.total === 145, 'الحساب الدقيق للإجمالي شاملاً الشحن والخصومات');

  // 6. اختبار الاستعلام وتتبع الطلب برقم الطلب ورقم الجوال
  const trackSuccess = await trackOrder(testOrderNumber, '0546002435');
  assert(trackSuccess.success && trackSuccess.order?.orderNumber === testOrderNumber, 'تتبع الطلب برقم الجوال ورقم الطلب الصحيح');

  const trackFail = await trackOrder(testOrderNumber, '0500000000');
  assert(!trackFail.success, 'منع كشف بيانات الطلب عند إدخال رقم جوال غير متطابق');

  // 7. اختبار تحديث حالة الطلب
  const updatedOrder = await updateOrderStatus(testOrderNumber, 'confirmed', 'تم التأكيد مع العميل هاتفياً');
  assert(updatedOrder?.status === 'confirmed', 'تحديث حالة الطلب إلى «مؤكد»');
  assert(updatedOrder?.adminNotes === 'تم التأكيد مع العميل هاتفياً', 'حفظ ملاحظات الإدارة على الطلب');

  // 8. اختبار رابط ورسالة واتساب المباشرة
  const waUrl = buildWhatsAppOrderMessage(sampleOrder, '+966546002435');
  assert(waUrl.includes('https://wa.me/966546002435'), 'رابط واتساب يستهدف رقم المؤسسة المعتمد 966546002435');
  assert(waUrl.includes(encodeURIComponent(testOrderNumber)), 'رسالة واتساب تحتوي على رقم الطلب');
  assert(waUrl.includes(encodeURIComponent('عبدالله الشمري')), 'رسالة واتساب تحتوي على اسم العميل');

  // 9. اختبار الإحصائيات في لوحة الإدارة
  const stats = await getDashboardStats();
  assert(stats.totalProducts >= 8, 'إحصاء عدد المنتجات الكلي في لوحة التحكم');
  assert(stats.recentOrders.length >= 1, 'ظهور الطلب المنشأ في قائمة أحدث الطلبات باللوحة');
  assert(stats.totalOrdersValue >= 145, 'احتساب إجمالي قيمة الطلبات المسجلة');

  // 10. اختبار إضافة وحذف منتج تجريبي
  const tempProd = await saveProduct({
    name: 'صنف تجريبي جديد',
    slug: `test-prod-${Date.now()}`,
    shortDescription: 'وصف تجريبي',
    description: 'وصف تفصيلي',
    categorySlug: 'eastern-sweets-baklava',
    variants: [
      {
        id: `var-test-${Date.now()}`,
        name: 'قطعة تجريبية',
        saleMethod: 'piece',
        unitValue: 1,
        unitName: 'قطعة',
        retailPrice: 10,
        retailDiscount: 0,
        retailDiscountType: 'percentage',
        wholesalePrice: 8,
        wholesaleDiscount: 0,
        wholesaleDiscountType: 'percentage',
        minWholesaleQty: 10,
        isWholesaleAvailable: true,
        isAvailable: true,
        sortOrder: 1,
      },
    ],
  });
  assert(!!tempProd._id, 'إضافة منتج جديد بنجاح');
  const delSuccess = await deleteProduct(tempProd._id);
  assert(delSuccess, 'حذف المنتج التجريبي بأمان');

  // 11. اختبار الفروع
  const branches = await getBranches(false);
  const hailHQ = branches.find((b) => b.isHQ);
  const riyadh = branches.find((b) => b.city === 'الرياض');
  assert(hailHQ?.isActive === true, 'فرع حائل هو المقر الرئيسي المعتمد والنشط');
  assert(riyadh?.isActive === false, 'موقع الرياض غير منشور كفرع معتمد حتى الاعتماد');

  console.log(`\n=== نتيجة الاختبارات: نجح ${passed} | فشل ${failed} ===`);
  if (failed === 0) {
    console.log('جميع اختبارات القبول اجتيزت بنسبة 100% بنجاح.');
  }
}

runAcceptanceTests().catch(console.error);

