// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: [
          '/(admin)/',
          '/login',
          '/signup',
          '/api/',
          '/dashboard',
          '/private/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://nextblog-blogging.vercel.app/sitemap.xml',
  };
}