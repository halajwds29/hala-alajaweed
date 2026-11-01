import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/types';
import { formatSAR } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    '/images/products/baklava-real.jpg';

  // Calculate lowest effective retail price
  const defaultVariant = product.variants[0];
  const lowestRetailPrice = product.variants.reduce((min, v) => {
    const eff =
      v.retailDiscount > 0
        ? v.retailDiscountType === 'percentage'
          ? v.retailPrice * (1 - v.retailDiscount / 100)
          : v.retailPrice - v.retailDiscount
        : v.retailPrice;
    return eff < min ? eff : min;
  }, defaultVariant?.retailPrice || 0);

  const hasWholesale = product.variants.some(
    (v) => v.isWholesaleAvailable && v.wholesalePrice > 0
  );

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-[#EBE3D7] hover:border-[#C5A059]/50 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-8px_rgba(104,45,67,0.12)] flex flex-col w-full max-w-full min-w-0">
      {/* Product Image Frame */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full bg-[#FAF6F0] overflow-hidden block"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
        />
        {/* Subtle luxury hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Product Information */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between w-full max-w-full min-w-0">
        <div className="w-full max-w-full min-w-0">
          {/* Category Eyebrow */}
          <div className="text-[9px] sm:text-[11px] font-semibold text-[#9F6A76] tracking-wider mb-1 truncate">
            {product.categoryName || 'حلويات فاخرة'}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-[#4A1D2E] text-xs sm:text-base group-hover:text-[#682D43] transition-colors duration-200 leading-snug line-clamp-1 mb-1 sm:mb-2 break-words">
            <Link href={`/products/${product.slug}`} className="block truncate">
              {product.name}
            </Link>
          </h3>

          {/* Short Description */}
          <p className="text-[10px] sm:text-xs text-[#6B5E62] line-clamp-2 leading-relaxed mb-2 sm:mb-4 break-words">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Call to Action */}
        <div className="pt-2 sm:pt-3 border-t border-[#F7F1E9] flex flex-col min-[380px]:flex-row min-[380px]:items-center justify-between gap-2 w-full max-w-full min-w-0">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-[#9F6A76] block">يبدأ من</span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xs sm:text-base font-bold text-[#682D43] font-mono whitespace-nowrap">
                {formatSAR(lowestRetailPrice)}
              </span>
              {hasWholesale && (
                <span className="text-[8px] sm:text-[9px] text-[#C5A059] font-medium bg-[#FAF6F0] px-1.5 py-0.5 rounded border border-[#EBE3D7]/60 whitespace-nowrap">
                  متوفر للجملة
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="w-full min-[380px]:w-auto inline-flex items-center justify-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold text-[#682D43] bg-[#FAF6F0] hover:bg-[#682D43] hover:text-[#FAF6F0] active:scale-95 transition-all duration-200 border border-[#EBE3D7] group/btn shrink-0"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:-translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}
