"use server";

import prisma from "@/lib/db";
// export async function getAllPublicPostsSlugs() {
//   // Return only { slug } for all published posts
//   const posts = await prisma.post.findMany({
//     where: { status: "published" },
//     select: { slug: true }
//   });
//   return posts;
// }
// Get a single blog post by slug (safe for SSG)
export const getBlogPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        user: { select: { name: true, image: true, id: true } },
        category: true,
      },
    });
    return post;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

// Update post views (called via API route)
export const updatePostViews = async (id: string) => {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    return post;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

// // Get top N published posts (for generateStaticParams)
export const getPublicPostsForSSG = async (limit = 100) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { slug: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return posts;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};


export const getAllCategories = async () => {
  try {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (err) {
    console.error({ err });
    throw new Error("Failed to fetch categories");
  }
};

export const getAllTags = async () => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { tags: true },
    });

    // Flatten all tags and remove duplicates
    const allTags = posts.flatMap(post => post.tags);
    const uniqueTags = Array.from(new Set(allTags));

    return uniqueTags.map(tag => ({ name: tag }));
  } catch (err) {
    console.error({ err });
    throw new Error("Failed to fetch tags");
  }
};