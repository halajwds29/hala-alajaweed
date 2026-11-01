import mongoose, { Schema, Model } from 'mongoose';
import { SiteSettings as SiteSettingsType } from '@/types';

const SiteSettingsSchema = new Schema<SiteSettingsType>(
  {
    storeName: { type: String, default: 'حلا الأجاويد' },
    brandNameAr: { type: String, default: 'مؤسسة حلا الأجاويد للحلويات' },
    brandNameEn: { type: String, default: 'HALA ALAJAWEED' },
    logoUrl: { type: String, default: '/images/logo.png' },
    logoHeight: { type: Number, default: 60 },
    heroImageUrl: { type: String, default: '/images/hero-patisserie.jpg' },
    heroImages: {
      type: [String],
      default: [
        '/images/hero-patisserie.jpg',
        '/images/products/baklava-real.jpg',
        '/images/products/chocolate-real.jpg',
        '/images/products/boxes-real.jpg',
      ],
    },
    storyImageUrl: { type: String, default: '/images/products/maamoul-real.jpg' },
    wholesaleImageUrl: { type: String, default: '/images/hero-patisserie.jpg' },
    phone: { type: String, default: '+966546002435' },
    whatsapp: { type: String, default: '+966546002435' },
    email: { type: String, default: 'halajwds@gmail.com' },
    address: { type: String, default: 'حائل — حي النقرة — المملكة العربية السعودية' },
    secondaryAddress: {
      type: String,
      default: 'الرياض — مركز التوريد وخدمة المناسبات — شحن سريع ومبرد',
    },
    additionalAddresses: {
      type: Array,
      default: [],
    },
    city: { type: String, default: 'حائل' },
    heroTitle: { type: String, default: 'حلا الأجاويد — نكهات أصيلة ولمسات عصرية' },
    heroSubtitle: {
      type: String,
      default:
        'اكتشف عالمًا من الحلويات الشعبية والشرقية والشوكولاتة والمعجنات ، بتشكيلات متنوعة تناسب ضيافتك ومناسباتك واحتياجاتك اليومية',
    },
    announcement: {
      type: String,
      default:
        'مؤسسة حلا الأجاويد للحلويات — فخر الضيافة السعودية الأصيلة | حائل (المقر الرئيسي) • الرياض (خدمة وتوريد) | شحن وتوصيل لكافة مدن ومناطق المملكة',
    },
    announcementSpeed: { type: Number, default: 25 },
    announcementEnabled: { type: Boolean, default: true },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/halajwds' },
      x: { type: String, default: 'https://x.com/halajwds' },
      tiktok: { type: String, default: 'https://tiktok.com/@halajwds' },
      snapchat: { type: String, default: 'https://snapchat.com/add/halajwds' },
      facebook: { type: String, default: 'https://facebook.com/halajwds' },
      whatsapp: { type: String, default: 'https://wa.me/966546002435' },
      whatsappCatalog: { type: String, default: 'https://wa.me/c/966546002435' },
      linkin1: { type: String, default: 'https://linkin1.com/halajwds' },
    },
    deliveryFee: { type: Number, default: 25 },
    freeDeliveryThreshold: { type: Number, default: 350 },
    isStoreOpen: { type: Boolean, default: true },
    promoPopup: {
      enabled: { type: Boolean, default: true },
      code: { type: String, default: 'AJAWEED10' },
      discountPercent: { type: Number, default: 10 },
      title: { type: String, default: 'كود خصم حصري للضيافة' },
      description: {
        type: String,
        default: 'استخدم كود الخصم عند تأكيد الطلب واحصل على خصم 10% فوري',
      },
      minOrderAmount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteSettingsModel: Model<SiteSettingsType> =
  mongoose.models.SiteSettings ||
  mongoose.model<SiteSettingsType>('SiteSettings', SiteSettingsSchema);

