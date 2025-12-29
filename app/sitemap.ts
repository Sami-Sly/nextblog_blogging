// app/sitemap.ts
import type { MetadataRoute } from "next";
import {
  getAllPublicPostsSlugs,
  getAllCategories,
  getAllTags,
} from "@/app/actions/blog-public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nextblog-blogging.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
  ];

  // Blog posts
  const postSlugs = await getAllPublicPostsSlugs();
  const blogPosts: MetadataRoute.Sitemap = postSlugs.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
  }));

  // Categories
  const categories = await getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/blog/category/${cat.id}`,
    lastModified: new Date(),
  }));

  // Tags
  const tags = await getAllTags();
  const tagPages: MetadataRoute.Sitemap = tags.map(tag => ({
    url: `${baseUrl}/blog/tag/${tag.name}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...blogPosts, ...categoryPages, ...tagPages];
}
