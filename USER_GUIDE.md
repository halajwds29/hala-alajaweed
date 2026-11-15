# 📖 دليل مستخدم متجر حلا الأجاويد | Hala Al-Ajaweed User Guide

مرحباً بكم في دليل الاستخدام الشامل لمنصة ومتجر **مؤسسة حلا الأجاويد للحلويات**.
يحتوي هذا الدليل على شرح تفصيلي لكافة وظائف المتجر الإلكتروني ولوحة التحكم الإدارية باللغتين **العربية** و**الإنجليزية**.

Welcome to the comprehensive user guide for the **Hala Al-Ajaweed Sweets & Pastries** e-commerce platform.
This manual provides complete documentation for both the storefront and the admin control panel in **Arabic** and **English**.

---

## 📑 فهرس المحتويات | Table of Contents

### الجزء الأول: باللغة العربية (Arabic Section)
1. [نظرة عامة على المنصة](#1-نظرة-عامة-على-المنصة)
2. [دليل العميل والمتسوق (Storefront)](#2-دليل-العميل-والمتسوق-storefront)
   - تصفح المنتجات والأقسام
   - سلة المشتريات وتطبيق أكواد الخصم
   - إتمام الطلب فائق السهولة (Checkout)
   - صفحة تأكيد الطلب والفاتورة
   - تتبع حالة الطلب برقم الجوال
   - طلبات التوريد والجملة والمناسبات
   - الفروع ومواقع الاستلام
3. [دليل لوحة التحكم الإدارية (Admin Dashboard)](#3-دليل-لوحة-التحكم-الإدارية-admin-dashboard)
   - تسجيل الدخول والأمان
   - لوحة الإحصائيات العامة
   - إدارة ومتابعة الطلبات
   - إدارة المنتجات (إضافة، تعديل، تسعير الجملة والتجزئة)
   - إدارة الأقسام والتصنيفات
   - مكتبة الوسائط ورفع الصور
   - إدارة الفروع والمقر الرئيسي
   - إدارة المحتوى والبانرات والشريط العلوي
   - إعدادات المتجر وأكواد الخصم وحساب الإدارة
4. [الأسئلة الشائعة والدعم الفني](#4-الأسئلة-الشائعة-والدعم-الفني)

---

### Part Two: English Section
1. [Platform Overview](#1-platform-overview)
2. [Customer & Storefront Guide](#2-customer--storefront-guide)
   - Browsing Categories & Products
   - Cart & Promo Code Application
   - Frictionless Checkout Flow
   - Order Confirmation & WhatsApp Invoice
   - Order Tracking via Mobile Number
   - Wholesale, Events & Catering Inquiries
   - Branches & Store Locations
3. [Admin Control Panel Guide](#3-admin-control-panel-guide)
   - Secure Login & Session Protection
   - Analytics & Sales Dashboard
   - Order Management & Status Updates
   - Product Catalog Management (Retail & Wholesale)
   - Categories & Navigation Management
   - Media Library & Cloudinary Image Uploads
   - Branches & Main Headquarters Setup
   - Content, Banners & Announcement Ticker
   - Store Settings, Discount Coupons & Admin Credentials
4. [Troubleshooting, Security & FAQs](#4-troubleshooting-security--faqs)

---

# 🇸🇦 الجزء الأول: الدليل باللغة العربية

---

## 1. نظرة عامة على المنصة

تم بناء منصة **حلا الأجاويد** لتوفير تجربة تسوق إلكتروني فاخرة تجمع بين عراقة التراث السعودي وأحدث تقنيات التجارة الإلكترونية الحديثة (**Next.js App Router**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, **Cloudinary**).

- **رابط المتجر الرسمي:** [https://halajwds.com](https://halajwds.com)
- **لوحة التحكم الإدارية:** [https://halajwds.com/admin](https://halajwds.com/admin)
- **الهوية البصرية:** العنابي الملكي الفاخر (`#682D43`)، العاجي الدافئ (`#FAF6F0`)، ولمسات الذهب الملكي (`#C5A059`)، بخط **تجوال (Tajawal)** العربي المعتمد.

---

## 2. دليل العميل والمتسوق (Storefront)

### 2.1 تصفح المنتجات والأقسام
1. **الصفحة الرئيسية:**
   - تضم سلايدر البانرات الإعلاني التفاعلي، يليه شبكة أقسام المتجر الثابتة والأنيقة (الحلويات الشرقية والبقلاوة، الحلويات الشعبية كالكليجا والمعمول، الشوكولاتة والكرانشي، الكاسات الحديثة، البيتيفور، الموالح، والبوكسات الملكية).
   - عرض مختارات الضيافة والمنتجات الأكثر طلباً.
2. **صفحة جميع المنتجات (`/products`) وصفحات الأقسام (`/categories/[slug]`):**
   - **البحث الفوري:** شريط بحث يتيح البحث باسم المنتج أو مكوناته أو وصفه.
   - **الترتيب حسب السعر:** الترتيب الافتراضي، من الأقل للأعلى، أو من الأعلى للأقل.
   - **تصفية أسعار الجملة:** زر مخصص يُظهر فوراً الأصناف المتاحة للبيع بالجملة ومناسبات التوريد.
   - **شريط الأقسام السريع (Category Pills):** أزرار تفاعلية تعرض عدد المنتجات المتاحة في كل قسم مع إمكانية التنقل اللحظي بينها.

### 2.2 صفحة تفاصيل المنتج وإضافته للسلة
1. الدخول على أي صنف بالضغط على صورة المنتج أو زر **«التفاصيل»**.
2. تصفح معرض الصور عالي الجودة والوصف الدقيق وبيانات السعرات الحرارية لكل 100 جرام.
3. **تحديد خيار البيع المناسب:**
   - بالعلبة (مثال: علبة 12 حبة، علبة 24 حبة).
   - بالوزن (مثال: نصف كيلو، 1 كيلو).
   - بالحجم (صغير، وسط، كبير).
4. تحديد الكمية المطلوبة، ثم الضغط على **«إضافة للسلة»**.

### 2.3 سلة المشتريات (`/cart`) وأكواد الخصم
1. الضغط على أيقونة **«السلة»** أعلى الصفحة لمعاينة محتوياتها.
2. إمكانية زيادة أو إنقاص الكمية، أو حذف أي منتج.
3. **تطبيق كود الخصم:**
   - إدخال كود الخصم (مثل: `AJAWEED10`) في حقل قسيمة الشراء والضغط على **«تطبيق»**.
   - يتم احتساب الخصم تلقائياً وتحديث الإجمالي مع بيان مقدار التوفير بالريال السعودي.
4. الضغط على **«متابعة الشراء وإتمام الطلب»**.

### 2.4 إتمام الطلب فائق السهولة (Checkout)
حرصاً على راحة العميل وتسريع الشراء لمنع ضياع الطلبات:
- **رقم الجوال فقط هو الإلزامي** لإتمام الطلب بنجاح.
- باقي الحقول (الاسم، المدينة، العنوان، الملاحظات) اختيارية للتيسير على العميل.
- اختيار طريقة الاستلام:
  - **توصيل إلى العنوان:** تحديد المدينة وكتابة العنوان التقديري.
  - **استلام من الفرع:** الاستلام المباشر من فرع حائل الرئيسي أو نقطة توزيع الرياض.
- اختيار وسيلة الدفع (الدفع عند الاستلام، أو تحويل بنكي / دفع مسبق).
- الضغط على زر **«تأكيد وإرسال الطلب»**.

### 2.5 صفحة نجاح الطلب والفاتورة السريعة (`/order-success/[orderNumber]`)
بمجرد تأكيد الطلب، تظهر شاشة احتفالية أنيقة تحتوي على:
1. **رقم الطلب الرسمي** (مثال: `ORD-1793623138`).
2. **كود الطلب السري** المكون من 6 أرقام مع زر نسخ بنقرة واحدة.
3. ملخص كامل للفاتورة وقيمة التوصيل والخصم المطبق.
4. زر أخضر بارز **«إرسال الفاتورة وتأكيدها عبر واتساب»** لفتح محادثة خدمة عملاء حلا الأجاويد برسالة جاهزة تحتوي كامل بيانات الطلب بنقرة واحدة.

### 2.6 تتبع حالة الطلب برقم الجوال (`/track-order`)
لا يحتاج العميل لحفظ رقم الطلب أو تسجيل الدخول:
1. التوجه لصفحة **«متابعة الطلب»** من القائمة الرئيسية.
2. إدخال **رقم الجوال** المسجل في الطلب والضغط على **«استعلام»**.
3. يعرض النظام فوراً أحدث طلب للعميل مع مسار زمني حي للمراحل:
   - 🟡 **جديد (بانتظار المراجعة)**
   - 🔵 **قيد التجهيز والتحضير**
   - 🟣 **جاري التوصيل / جاهز للاستلام**
   - 🟢 **مكتمل وتم التسليم**
4. إذا كان للعميل أكثر من طلب سابق، يمكنه التنقل بينها ومعاينة تواريخها وقيمتها المالية.

### 2.7 طلبات التوريد والجملة والمناسبات (`/wholesale`)
صفحة مخصصة لأصحاب المقاهي، قاعات الأفراح، الفنادق، والشركات:
- ملء نموذج طلب التوريد (الاسم، رقم الجوال، نوع الطلب، والكميات المطلوبة).
- يتم إرسال النموذج تلقائياً إلى البريد الإلكتروني الرسمي للإدارة **`info@halajwds.com`** مع إمكانية إرسال نسخة عبر واتساب بنقرة واحدة.

### 2.8 الفروع ومواقع الاستلام (`/branches`)
- استعراض بيانات الفروع المعتمدة:
  - **المقر والمصنع الرئيسي — حائل:** حي النقرة، شارع فهد العلي العريفي.
  - **موقع الرياض (العنوان الوطني والتوريد):** حي العريجاء الغربية، شارع مارية القبطية.
- روابط مباشرة لخرائط Google Maps، وأرقام التواصل المباشر وأوقات العمل.

---

## 3. دليل لوحة التحكم الإدارية (Admin Dashboard)

> [!IMPORTANT]
> للوصول للوحة الإدارة: افتح الرابط **`https://halajwds.com/admin`** أو أضف `/admin` في نهاية عنوان الموقع.

### 3.1 تسجيل الدخول والأمان
1. أدخل **اسم المستخدم** و**كلمة المرور** المعتمدة للإدارة.
2. الجلسة محمية بملفات تعريف ارتباط مشفرة بـ JWT آمنة من الاختراق (`HttpOnly Cookies`).
3. يمكنك تعديل بيانات الدخول في أي وقت من قسم **«الإعدادات»**.

---

### 3.2 لوحة الإحصائيات العامة (`/admin`)
تعرض لمحة فورية ومحدثة عن مؤشرات أداء المتجر:
- **إجمالي المبيعات بالريال السعودي.**
- **عدد الطلبات الإجمالي** وتوزيعها (الطلبات الجديدة، قيد التجهيز، المكتملة).
- **أحدث الطلبات المسجلة** مع إمكانية الدخول السريع لأي طلب.

---

### 3.3 إدارة الطلبات (`/admin/orders`)
1. **استعراض الطلبات:** قائمة مفصلة بجميع الطلبات تشمل (رقم الطلب، اسم العميل، رقم الجوال، الإجمالي، التاريخ، والحالة الحالية).
2. **تصفية وبحث الطلبات:** إمكانية البحث برقم الجوال، اسم العميل، أو تصفية الطلبات بحسب حالتها (جديد، قيد التجهيز، مكتمل، ملغي).
3. **تفاصيل الطلب الفردي:**
   - الضغط على أي طلب لمعاينة الفاتورة الكاملة والأصناف وخيارات البيع والكميات.
   - **تعديل حالة الطلب:** قائمة منسدلة لتحديث الحالة فوراً (يظهر التحديث لحظياً للعميل عند تتبعه للطلب).
   - **زر مراسلة العميل عبر واتساب:** يفتح محادثة واتساب مع رقم العميل بنقرة واحدة مع رسالة متابعة مخصصة تتضمن رقم الطلب وحالته.
   - **طباعة الفاتورة:** زر لطباعة فاتورة رسمية منسقة ببيانات المتجر والضريبة.

---

### 3.4 إدارة المنتجات (`/admin/products`)
#### أ) استعراض المنتجات:
- جدول يعرض صورة المنتج، اسمه بالعربية والإنجليزية، القسم التابع له، أسعار البيع، وحالة التوفر والنشر.
- خيارات سريعة: تعديل المنتج، تبديل حالة التوفر (متوفر / غير متوفر)، أو حذف المنتج.

#### ب) إضافة منتج جديد أو تعديل منتج قائم:
1. **البيانات الأساسية:**
   - **اسم المنتج بالعربية** (مثال: بقلاوة ملكية بالفستق).
   - **الاسم بالإنجليزية** (اختياري).
   - **الرابط التعريفي (Slug):** يتم توليده تلقائياً وبشكل نظيف وخالٍ من المسافات لضمان التوافق مع محركات البحث.
   - **القسم والتصنيف:** اختيار القسم الذي ينتمي له المنتج من القائمة المنسدلة.
   - **الوصف المختصر والوصف التفصيلي:** كتابة تفاصيل الطعم والمكونات والمناسبة.
2. **صور المنتج (Media Upload):**
   - يدعم رفع **حتى 25 صورة** للمنتج الواحد من الجوال أو الكمبيوتر مباشرة.
   - يتم ضغط الصور تلقائياً ورفعها إلى السحابة (**Cloudinary**) بسرعة وأمان.
   - إمكانية تحديد الصورة الرئيسية بالضغط على أيقونة النجمة، أو حذف أي صورة، أو إعادة ترتيبها.
3. **خيارات وأسعار البيع (Variants):**
   - إضافة خيار بيع واحد أو خيارات متعددة (مثال: خيار 500 جرام، خيار 1 كيلو).
   - تحديد طريقة البيع: بالعلبة، بالوزن، أو بالحجم.
   - **سعر التجزئة (القطاعي):** السعر الأساسي للزبائن.
   - **خصم التجزئة:** إمكانية تحديد نسبة مئوية (مثال: 10%) أو مبلغ ثابت مخصوم.
   - **أسعار وخيارات الجملة:** تفعيل خيار الجملة، تحديد سعر الجملة الخاص، والحد الأدنى للكمية (مثال: 10 علب).
4. **البيانات الغذائية والأوزان:**
   - السعرات الحرارية ومعيار الحساب (لكل 100 جرام، أو للقطعة).
   - الوزن الإجمالي.
5. **إعدادات النشر ومحركات البحث (SEO):**
   - تعيين المنتج كـ «منتج مميز» ليظهر في الصفحة الرئيسية.
   - تخصيص عنوان ووصف السيو للظهور في Google.
   - الضغط على **«حفظ المنتج»**.

---

### 3.5 إدارة الأقسام والتصنيفات (`/admin/categories`)
1. **استعراض الأقسام:** ترتيب الأقسام المسجلة في المتجر مع صورها الدائرية وحالة النشر.
2. **إضافة / تعديل قسم:**
   - اسم القسم بالعربية والإنجليزية.
   - الرابط التعريفي للقسم (Slug).
   - رفع صورة معبرة للقسم أو اختيار مسار صورة مخصص.
   - كتابة وصف تعريفي يظهر في ترويسة القسم لتعزيز محركات البحث.
   - ترتيب ظهور القسم وتحديد ما إذا كان القسم نشطاً ومعروضاً.

---

### 3.6 مكتبة الوسائط ورفع الصور (`/admin/media`)
- تتيح رفع مجموعة صور دفعة واحدة وتخزينها سحابياً.
- زر **«نسخ المسار»** لكل صورة لاستخدامه في أي بنر أو مقال أو خلفية.
- معاينة أحجام الملفات والبحث في الصور المرفوعة.

---

### 3.7 إدارة الفروع ومناطق الخدمة (`/admin/branches`)
1. تعديل بيانات الفروع القائمة أو إضافة نقاط توزيع جديدة.
2. **تعيين المقر الرئيسي المعتمد (HQ Exclusivity):**
   - عند تحديد أي فرع كمقر رئيسي، يقوم النظام تلقائياً بضبط حصرية المقر وإلغاء صفة المقر عن الفروع الأخرى لضمان عدم حدوث أي تضارب أمام العملاء.
3. إدخال العنوان الوطني، رابط خرائط Google Maps، أرقام الهواتف، وأوقات العمل الرسمية.

---

### 3.8 إدارة المحتوى والبانرات (`/admin/content`)
1. **الشريط الإعلاني العلوي (Announcement Bar):**
   - تعديل نص الإعلان ورابط التوجيه.
   - تفعيل أو إيقاف الشريط، والتحكم في سرعة تحركه بالثواني.
2. **سلايدر الصفحة الرئيسية (Hero Slider):**
   - إضافة شرائح صور وبانرات جديدة للواجهة مع العناوين والأزرار الترويجية.
3. **نصوص قصة المتجر والتواصل:**
   - تحديث نصوص صفحة «من نحن» وقصة التأسيس وروابط التواصل الاجتماعي.

---

### 3.9 الإعدادات وأكواد الخصم وحساب الإدارة (`/admin/settings`)
1. **إعدادات الشحن والتوصيل:**
   - تحديد رسوم التوصيل الافتراضية بالريال.
   - تحديد الحد الأدنى لقيمة الطلب للحصول على **الشحن المجاني**.
   - تفعيل أو إيقاف رسوم الدفع عند الاستلام.
2. **أكواد الخصم والبروموكود (Promo Codes):**
   - إنشاء أكواد ترويجية مخصصة (مثال: `RAMADAN20`, `WELCOME`).
   - تحديد نوع الخصم: نسبة مئوية (مثال: 15%) أو خصم نقدي ثابت (مثال: 30 ريال).
   - تحديد تاريخ انتهاء صلاحية الكود والحد الأدنى للطلب.
3. **أمان وحساب الإدارة (Change Credentials):**
   - إمكانية تحديث اسم مستخدم الإدارة وكلمة المرور الجديدة في أي وقت مع تشفير كامل على السيرفر.

---

## 4. الأسئلة الشائعة والدعم الفني

#### س1: أضفت منتجاً جديداً ولم يظهر في الصفحة الرئيسية؟
- **الجواب:** تأكد من تفعيل خيار **«منتج مميز»** داخل شاشة تعديل المنتج، حيث تعرض الصفحة الرئيسية المنتجات المحددة كمميزة فقط، بينما تظهر جميع المنتجات في صفحة `/products`.

#### س2: كيف أقوم بتعديل رقم الواتساب الذي يستقبل رسائل الطلبات؟
- **الجواب:** من لوحة الإدارة توجه إلى **«الإعدادات والربط»** ثم حدّث رقم الواتساب مع كتابة مفتاح الدولة (مثال: `+966546002435`).

#### س3: هل أسعار الجملة تظهر لجميع العملاء؟
- **الجواب:** نعم، تظهر خيارات الجملة بوضوح في بطاقة المنتج وفي صفحة تفاصيل المنتج عند تفعيل خيار الجملة، مع إيضاح الحد الأدنى للكمية للحصول على سعر الجملة التنافسي.

#### س4: أين أجد خريطة الموقع الخاصة بمحركات البحث Google؟
- **الجواب:** خريطة الموقع الرسمية متوفرة دائماً ومحدثة تلقائياً عبر الرابط:
  [https://halajwds.com/sitemap.xml](https://halajwds.com/sitemap.xml)

---
---

# 🇬🇧 Part Two: English User Guide

---

## 1. Platform Overview

**Hala Al-Ajaweed Sweets & Pastries** is a modern, high-performance luxury e-commerce web platform engineered with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, and **Cloudinary** cloud storage.

- **Official Storefront:** [https://halajwds.com](https://halajwds.com)
- **Admin Control Panel:** [https://halajwds.com/admin](https://halajwds.com/admin)
- **Brand Palette:** Royal Burgundy (`#682D43`), Warm Ivory (`#FAF6F0`), Royal Gold (`#C5A059`), and typography set in **Tajawal**.

---

## 2. Customer & Storefront Guide

### 2.1 Browsing Categories & Products
1. **Homepage:**
   - Features an interactive promotional hero slider, followed by a luxury static categories grid (Eastern Sweets & Baklava, Traditional Kleicha & Maamoul, Crunchy & Chocolates, Modern Cheesecake Cups, Petit Fours, Savory Pastries, and VIP Hospitality Boxes).
2. **Product Catalog (`/products`) and Category Pages (`/categories/[slug]`):**
   - **Instant Search:** Search in real-time by product title, description, or ingredients.
   - **Price Sorting:** Sort by Default, Price: Low to High, or Price: High to Low.
   - **Wholesale Price Toggle:** A one-click toggle button to display only items available for bulk and catering orders.
   - **Category Filter Pills:** Dynamic strip showing live product counts for each category with instant seamless switching.

### 2.2 Product Details & Variant Selection
1. Click on any product card or the **«Details»** button to access the configurator page (`/products/[slug]`).
2. High-resolution gallery with zoom, full description, and nutritional calorie count per 100g.
3. **Choose Sale Variant:**
   - By Box (e.g., 12 pcs box, 24 pcs box).
   - By Weight (e.g., 500g, 1kg).
   - By Size (Small, Medium, Large).
4. Select quantity and click **«Add to Cart»**.

### 2.3 Shopping Cart & Discount Codes (`/cart`)
1. Access the cart anytime via the shopping bag icon in the top header.
2. Increment/decrement item quantities or remove items.
3. **Apply Promo Codes:**
   - Enter your coupon code (e.g., `AJAWEED10`) and press **«Apply»**.
   - Discounts calculate immediately and display the total savings in Saudi Riyals (SAR).
4. Click **«Proceed to Checkout»**.

### 2.4 Frictionless Checkout Flow (`/checkout`)
Engineered to maximize conversion and reduce drop-offs:
- **Only the Mobile Number is strictly required** to place an order.
- Customer Name, City, and Detailed Address are optional with smart fallbacks.
- **Delivery Options:**
  - Standard Delivery to Address.
  - In-Store Branch Pickup (Hail HQ or Riyadh distribution hub).
- **Payment Methods:**
  - Cash / Card on Delivery.
  - Bank Transfer / Advance Payment.
- Click **«Confirm & Place Order»**.

### 2.5 Order Confirmation & WhatsApp Invoice (`/order-success/[orderNumber]`)
Upon successful placement, an order celebration screen renders:
1. **Official Order Number** (e.g., `ORD-1793623138`).
2. **6-Digit Secret Security Code** with a 1-click copy button.
3. Detailed itemized invoice breakdown (Subtotal, Delivery Fee, VAT, and Applied Discounts).
4. **«Send & Confirm on WhatsApp»** button to open the store's customer service chat with a pre-filled invoice message in one tap.

### 2.6 Order Tracking via Mobile Number (`/track-order`)
Customers do not need accounts or login credentials:
1. Navigate to **«Track Order»** in the header navigation.
2. Enter the **Mobile Number** used during checkout and click **«Track»**.
3. Live status progression renders:
   - 🟡 **New Order (Pending Review)**
   - 🔵 **In Preparation & Packaging**
   - 🟣 **Out for Delivery / Ready for Pickup**
   - 🟢 **Completed & Delivered**
4. If the customer placed multiple orders, they can toggle between all their previous orders.

### 2.7 Wholesale, Events & B2B Catering (`/wholesale`)
Designed for cafes, wedding halls, hotels, and recurring business orders:
- Simple inquiry form (Name, Mobile, Order Type, and Quantity).
- Automated submission sends an immediate email to **`info@halajwds.com`** and provides an instant WhatsApp submission fallback.

### 2.8 Branches & Pick-Up Hubs (`/branches`)
- Comprehensive overview of physical locations:
  - **Hail Main Factory & HQ:** Al-Naqra District, Fahad Al-Ali Al-Araifi St.
  - **Riyadh National Address & Logistics Hub:** West Oraija, Maria Al-Qibtiyya St.
- Direct links to Google Maps navigation, phone numbers, and working hours.

---

## 3. Admin Control Panel Guide

> [!IMPORTANT]
> Access the admin panel at **`https://halajwds.com/admin`**.

### 3.1 Secure Authentication
1. Log in with your authorized admin credentials.
2. Protected with tamper-proof JWT tokens stored in encrypted `HttpOnly` session cookies.
3. Password and username can be safely rotated anytime in the **Settings** section.

---

### 3.2 Analytics & Overview (`/admin`)
Live performance dashboard providing:
- **Total Revenue (SAR)** across all sales.
- **Total Order Volume** broken down by order state (New, Processing, Delivered).
- **Recent Orders Feed** with one-click direct inspection.

---

### 3.3 Order Management (`/admin/orders`)
1. **Order Listing:** Tabular view showing Order Number, Customer Name, Phone, Total Amount, Date, and Status.
2. **Filter & Search:** Live search by customer phone number or name, and status filter pills (New, Processing, Completed, Cancelled).
3. **Single Order Inspection:**
   - View items ordered, selected packaging sizes, and delivery notes.
   - **Update Order Status:** Change order stage instantly via the dropdown (syncs immediately to customer tracking).
   - **Direct WhatsApp Messaging:** Click the WhatsApp button to chat with the customer with a pre-composed status update.
   - **Print Invoice:** Generates a branded printable thermal / A4 invoice.

---

### 3.4 Product Catalog Management (`/admin/products`)
#### A) Product List:
- View all active catalog items with thumbnails, Arabic & English names, category, price ranges, and publishing status.
- Quick toggles to make products Available/Unavailable or delete items.

#### B) Creating & Editing Products:
1. **Basic Info:**
   - Arabic Product Title (e.g., بقلاوة ملكية بالفستق).
   - English Title (optional).
   - **Slug:** Automatically generated and sanitized (lowercase, hyphenated, space-free) for optimal Google SEO indexing.
   - **Category Selection:** Assign the product to its respective store category.
   - Short and detailed descriptions.
2. **Image Uploads (Up to 25 Photos):**
   - Upload up to 25 photos simultaneously directly from your phone or computer.
   - Automatically compressed and uploaded to **Cloudinary** CDN storage.
   - Set the primary thumbnail with the star icon, delete photos, or reorder them.
3. **Sale Variants & Pricing:**
   - Add single or multiple variants (e.g., 500g, 1000g, 12 pcs box).
   - Select sale method: Box, Weight, or Size.
   - **Retail Price (SAR)** and optional discounts (percentage or fixed amount).
   - **Wholesale Price (SAR)** and minimum wholesale quantity threshold.
4. **Nutrition & Weights:**
   - Calorie count and measurement basis (per 100g or per piece).
   - Net weight.
5. **SEO & Feature Toggles:**
   - Check **«Featured Product»** to show on the homepage.
   - Custom SEO Meta Title and Meta Description for Google indexing.
   - Click **«Save Product»**.

---

### 3.5 Category Management (`/admin/categories`)
1. View all 7 active categories with their circular thumbnails, sort order, and visibility.
2. **Add / Edit Category:**
   - Category Arabic and English names.
   - Slug identifier.
   - Circular preview image upload.
   - Category SEO description that displays on the category banner.
   - Sort order index and active/inactive display toggle.

---

### 3.6 Media Library (`/admin/media`)
- Multi-file batch image uploader.
- Quick **«Copy Path»** button to reuse uploaded image URLs in banners, announcements, or custom content.

---

### 3.7 Branch Management & Headquarters (`/admin/branches`)
1. Create, edit, and toggle visibility of store locations and service hubs.
2. **HQ Exclusivity Rule:**
   - When marking a branch as **Main Headquarters (المقر الرئيسي)**, the system automatically unsets the HQ flag from all other branches to maintain single-HQ consistency across the storefront.
3. Fill in National Address building numbers, Google Maps URLs, phone numbers, and operating hours.

---

### 3.8 Content & Banner Management (`/admin/content`)
1. **Announcement Ticker Bar:**
   - Edit the marquee text and optional click-through link.
   - Control animation scroll speed in seconds or toggle visibility.
2. **Hero Image Slider:**
   - Upload and schedule promotional homepage hero banners with custom call-to-action buttons.
3. **About & Story Copy:**
   - Edit the company story, heritage text, and social media URLs.

---

### 3.9 Store Settings, Coupons & Security (`/admin/settings`)
1. **Shipping & Delivery Rules:**
   - Default flat delivery fee (SAR).
   - Free shipping cart threshold (e.g., Free delivery above 200 SAR).
   - Cash on delivery fee toggle.
2. **Promo Codes & Coupons:**
   - Create custom promotional codes (e.g., `AJAWEED10`, `EID2026`).
   - Define discount type (Percentage % or Fixed SAR discount).
   - Set expiry dates and minimum order totals.
3. **Security & Credentials:**
   - Change the administrator username and password securely anytime with bcrypt-hashed server encryption.

---

## 4. Troubleshooting, Security & FAQs

#### Q1: A newly added product does not show up on the homepage?
- **Answer:** Ensure the **«Featured Product»** toggle is checked inside the product editor. The homepage displays only featured specialties, while `/products` displays all catalog items.

#### Q2: How can I change the WhatsApp customer service phone number?
- **Answer:** In the admin panel, navigate to **«Settings & Integration»** and update the WhatsApp phone number with international country code (e.g., `+966546002435`).

#### Q3: Where is the Google Search Console XML Sitemap located?
- **Answer:** The official production sitemap is auto-generated and continuously updated at:
  [https://halajwds.com/sitemap.xml](https://halajwds.com/sitemap.xml)

#### Q4: How are customer orders protected against database interruptions?
- **Answer:** The system uses atomic MongoDB transactions backed by automated local cache resilience. Orders are assigned unique sequential timestamps and duplicate-submission guards prevent duplicate billing.

---

*صُمم وطُوّر لمؤسسة حلا الأجاويد للحلويات — حائل، المملكة العربية السعودية.*  
*Designed & Developed for Hala Al-Ajaweed Sweets & Pastries — Hail, Kingdom of Saudi Arabia.*
