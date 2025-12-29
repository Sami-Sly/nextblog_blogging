// // app/sitemap.ts
// import type { MetadataRoute } from "next";
// import {
//   getAllPublicPostsSlugs,
//   getAllCategories,
//   getAllTags,
// } from "@/app/actions/blog-public";

// type SitemapItem = MetadataRoute.Sitemap[number];

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = "https://nextblog-blogging.vercel.app";

//   // Static pages
//   const staticPages: SitemapItem[] = [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1.0,
//     },
//     {
//       url: `${baseUrl}/blog`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 0.9,
//     },
//   ];

//   // Blog posts
//   const postSlugs = await getAllPublicPostsSlugs();
//   const blogPosts: SitemapItem[] = postSlugs.map(post => ({
//     url: `${baseUrl}/blog/${post.slug}`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.8,
//   }));

//   // Categories
//   const categories = await getAllCategories();
//   const categoryPages: SitemapItem[] = categories.map(cat => ({
//     url: `${baseUrl}/blog/category/${cat.id}`,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 0.7,
//   }));

//   // Tags
//   const tags = await getAllTags();
//   const tagPages: SitemapItem[] = tags.map(tag => ({
//     url: `${baseUrl}/blog/tag/${tag.name}`,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 0.6,
//   }));

//   return [...staticPages, ...blogPosts, ...categoryPages, ...tagPages];
// }
