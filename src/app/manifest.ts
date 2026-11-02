import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'حلا الأجاويد — نكهات أصيلة ولمسات عصرية',
    short_name: 'حلا الأجاويد',
    description: 'مؤسسة حلا الأجاويد للحلويات الشعبية والشرقية والشوكولاتة والمعجنات وبوكسات الضيافة',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF6F0',
    theme_color: '#682D43',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}

