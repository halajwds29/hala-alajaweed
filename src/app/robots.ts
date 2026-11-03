import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://halajwds.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/order-success/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
