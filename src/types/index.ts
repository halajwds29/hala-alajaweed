export type SaleMethod = 'piece' | 'box' | 'weight' | 'size';

export type DiscountType = 'percentage' | 'amount';

export interface ProductVariant {
  id: string;
  name: string;
  saleMethod: SaleMethod;
  unitValue: number;
  unitName: string; // e.g. "قطعة", "علبة 12 حبة", "كيلو", "نصف كيلو", "وسط"
  retailPrice: number;
  retailDiscount: number;
  retailDiscountType: DiscountType;
  wholesalePrice: number;
  wholesaleDiscount: number;
  wholesaleDiscountType: DiscountType;
  minWholesaleQty: number;
  isWholesaleAvailable: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

export interface ProductImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  categoryName?: string;
  images: ProductImage[];
  calories?: number;
  caloriesBasis?: string; // e.g. "لكل 100 جرام", "لكل قطعة"
  weight?: string;
  isAvailable: boolean;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  categorySlug: string;
  image: string;
  variantId: string;
  variantName: string;
  saleMethod: SaleMethod;
  unitName: string;
  quantity: number;
  isWholesale: boolean;
  retailPrice: number;
  retailDiscount: number;
  retailDiscountType: DiscountType;
  wholesalePrice: number;
  wholesaleDiscount: number;
  wholesaleDiscountType: DiscountType;
  minWholesaleQty: number;
  calculatedPrice: number; // Current effective unit price
  originalPrice: number;
}

export type OrderStatus =
  | 'new'
  | 'reviewing'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  saleMethod: SaleMethod;
  unitName: string;
  quantity: number;
  unitPrice: number;
  regularPrice: number;
  discountAmount: number;
  totalPrice: number;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    district: string;
    address: string;
  };
  orderType: 'retail' | 'wholesale';
  deliveryMethod: 'delivery' | 'pickup';
  items: OrderItemSnapshot[];
  subtotal: number;
  discountTotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  customerNotes?: string;
  adminNotes?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  _id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  mapUrl: string;
  phone: string;
  workingHours: string;
  isActive: boolean;
  isHQ: boolean;
  serviceAreas: string[];
}

export interface CustomAddressItem {
  id: string;
  title: string;
  address: string;
  phone?: string;
  mapUrl?: string;
}

export interface SiteSettings {
  storeName: string;
  brandNameAr: string;
  brandNameEn: string;
  logoUrl?: string;
  logoHeight?: number;
  heroImageUrl?: string;
  heroImages?: string[];
  storyImageUrl?: string;
  wholesaleImageUrl?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  secondaryAddress?: string;
  additionalAddresses?: CustomAddressItem[];
  city: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  announcementSpeed?: number;
  announcementEnabled?: boolean;
  socialLinks: {
    instagram: string;
    x: string;
    tiktok: string;
    snapchat: string;
    facebook?: string;
    whatsapp?: string;
    whatsappCatalog?: string;
    linkin1?: string;
    googleMapsRiyadh?: string;
  };
  deliveryFee: number;
  freeDeliveryThreshold: number;
  isStoreOpen: boolean;
  promoPopup?: {
    enabled: boolean;
    code: string;
    discountPercent: number;
    title: string;
    description: string;
    minOrderAmount?: number;
  };
}

