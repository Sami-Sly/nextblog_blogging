"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";

const PAGE_SIZE = 10;

// // Get paginated posts for admin dashboard
// export const getPosts = async (page: number) => {
//   const skip = (page - 1) * PAGE_SIZE;
//   const session = await authSession();

//   if (!session?.user.id) throw new Error("Unauthorized");

//   const currentUser = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: { savedPosts: true },
//   });

//   try {
//     const [posts, totalCount] = await prisma.$transaction([
//       prisma.post.findMany({
//         skip,
//         take: PAGE_SIZE,
//         orderBy: { updatedAt: "desc" },
//         include: {
//           user: { select: { image: true, name: true, id: true, savedPosts: true } },
//           category: true,
//         },
//       }),
//       prisma.post.count(),
//     ]);

//     return {
//       posts: posts.map(post => ({ ...post, savedPosts: currentUser?.savedPosts ?? [] })),
//       totalPages: Math.ceil(totalCount / PAGE_SIZE),
//       currentPage: page,
//     };
//   } catch (err) {
//     console.error({ err });
//     throw new Error("Something went wrong");
//   }
// };



export const getPosts = async (page: number) => {
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const session = await authSession();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Get current user's savedPosts safely
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { savedPosts: true },
    });

    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        skip,
        take: PAGE_SIZE,
        orderBy: { updatedAt: "desc" },
        include: {
          user: {
            select: { image: true, name: true, id: true, savedPosts: true },
          },
          category: true,
        },
      }),
      prisma.post.count(),
    ]);

const safePosts = posts.map((post) => ({
  id: post.id,
  userId: post.userId,
  title: post.title ?? "",
  slug: post.slug ?? "",
  content: post.content ?? "",
  imageUrl: post.imageUrl ?? "",
  imageAlt: post.imageAlt ?? null,
  views: post.views ?? 0,
  tags: Array.isArray(post.tags) ? post.tags : [],
  status: post.status ?? "draft",
  categoryId: post.categoryId ?? null,
  category: post.category ?? null,
  user: post.user ?? null,
  savedPosts: Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts
    : [],
  seoTitle: post.seoTitle ?? null,
  seoDescription: post.seoDescription ?? null,
  canonicalUrl: post.canonicalUrl ?? null,
  primaryKeyword: post.primaryKeyword ?? null,
  ogImage: post.ogImage ?? null,
  // twitterImage: post.twitterImage ?? null,      // ✅ add this
  // featuredImage: post.featuredImage ?? null,    // ✅ add this
  author: post.author ?? null,
  datePublished: post.datePublished ?? new Date(),
  dateModified: post.dateModified ?? new Date(),
  readingTime: post.readingTime ?? null,
  noIndex: post.noIndex ?? false,
  createdAt: post.createdAt,                   // ✅ add this
  updatedAt: post.updatedAt,                   // ✅ add this
}));


    return {
      posts: safePosts,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error("getPosts error:", err);
    throw new Error("Something went wrong while fetching posts");
  }
};

// Get posts by category (admin)
export const getPostsByCategory = async (categoryId: string, page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();
  if (!session?.user.id) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { savedPosts: true },
  });

  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: { categoryId },
        skip,
        take: PAGE_SIZE,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { image: true, name: true, id: true, savedPosts: true } },
          category: true,
        },
      }),
      prisma.post.count({ where: { categoryId } }),
    ]);

    return {
      posts: posts.map(post => ({ ...post, savedPosts: currentUser?.savedPosts ?? [] })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

// Get posts by tag (admin)
export const getPostsByTag = async (tag: string, page: number) => {
  const skip = (page - 1) * PAGE_SIZE;
  const session = await authSession();
  if (!session?.user.id) throw new Error("Unauthorized");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { savedPosts: true },
  });

  try {
    const [posts, totalCount] = await prisma.$transaction([
      prisma.post.findMany({
        where: { tags: { has: tag } },
        skip,
        take: PAGE_SIZE,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { image: true, name: true, id: true, savedPosts: true } },
          category: true,
        },
      }),
      prisma.post.count({ where: { tags: { has: tag } } }),
    ]);

    return {
      posts: posts.map(post => ({ ...post, savedPosts: currentUser?.savedPosts ?? [] })),
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};
