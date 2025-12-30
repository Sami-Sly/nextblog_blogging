import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/api/',
          '/dashboard',
          '/(admin)',
          '/(auth)',
          '/_next/'
        ],
      },
    ],
    sitemap: 'https://nextblog-blogging.vercel.app/sitemap.xml',
  };
}
