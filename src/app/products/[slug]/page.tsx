import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductBySlug, getProducts } from '@/lib/data-service';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import ProductCard from '@/components/ProductCard';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'المنتج غير موجود' };

  const primaryImage = product.images[0]?.url;

  return {
    title: product.seoTitle || `${product.name} | حلا الأجاويد`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products in the same category
  const related = (await getProducts({ categorySlug: product.categorySlug, limit: 5 }))
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  // Structured Data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.description || product.shortDescription,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'حلا الأجاويد',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'SAR',
      lowPrice: product.variants[0]?.retailPrice || 0,
      highPrice: product.variants[product.variants.length - 1]?.retailPrice || 0,
      offerCount: product.variants.length,
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 w-full max-w-full min-w-0">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#9F6A76] flex-wrap">
        <Link href="/" className="hover:text-[#682D43]">
          الرئيسية
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-[#682D43]">
          المنتجات
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-[#682D43]">
          {product.categoryName || 'القسم'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#4A1D2E] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Configurator Client */}
      <ProductDetailsClient product={product} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-[#E7DCD0] space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#4A1D2E]">
              أصناف أخرى قد تعجبك
            </h2>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="text-xs font-bold text-[#682D43] hover:text-[#C5A059]"
            >
              عرض المزيد من هذا القسم
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-full min-w-0">
            {related.map((rel) => (
              <ProductCard key={rel.slug} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

