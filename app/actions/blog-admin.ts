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
  // Core
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

  // SEO
  seoTitle: post.seoTitle ?? null,
  seoDescription: post.seoDescription ?? null,
  canonicalUrl: post.canonicalUrl ?? null,
  primaryKeyword: post.primaryKeyword ?? null,
  ogImage: post.ogImage ?? post.imageUrl ?? null,
  noIndex: post.noIndex ?? false,

  // Author & Dates
  author: post.author ?? null,
  authorCredentials: post.authorCredentials ?? null, // ✅
  authorProfileUrl: post.authorProfileUrl ?? null,   // ✅
  authorExperienceYrs: post.authorExperienceYrs ?? null, // ✅
  datePublished: post.datePublished ?? post.createdAt,
  dateModified: post.dateModified ?? post.updatedAt,
  readingTime: post.readingTime ?? null,

  // Medical Review
  reviewedBy: post.reviewedBy ?? null,               // ✅
  reviewerCredentials: post.reviewerCredentials ?? null, // ✅
  medicalReviewDate: post.medicalReviewDate ?? null, // ✅

  // Medical Entity Graph
  mainEntity: post.mainEntity ?? null,               // ✅
  medicalSpecialty: post.medicalSpecialty ?? null,   // ✅
  medicalConditions: Array.isArray(post.medicalConditions)
    ? post.medicalConditions
    : [], // ✅
  symptoms: Array.isArray(post.symptoms) ? post.symptoms : [], // ✅
  treatments: Array.isArray(post.treatments) ? post.treatments : [], // ✅
  medications: Array.isArray(post.medications) ? post.medications : [], // ✅

  // Freshness
  lastMedicalUpdate: post.lastMedicalUpdate ?? null, // ✅
  contentVersion: post.contentVersion ?? null,       // ✅

  // Intent & Trust
  intent: post.intent ?? null,                       // ✅
  editorialPolicyUrl: post.editorialPolicyUrl ?? null, // ✅
  medicalBoardUrl: post.medicalBoardUrl ?? null,     // ✅
  hasDisclaimer: post.hasDisclaimer ?? true,         // ✅
  riskLevel: post.riskLevel ?? null,                 // ✅

  // Publisher
  publisherName: post.publisherName ?? null,         // ✅
  publisherUrl: post.publisherUrl ?? null,           // ✅
  publisherLogoUrl: post.publisherLogoUrl ?? null,   // ✅

  // Citations & Audience
  citations: Array.isArray(post.citations) ? post.citations : [], // ✅
  targetAudience: post.targetAudience ?? null,       // ✅

  // Timestamps
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,

  // User-specific (keep as needed)
  savedPosts: Array.isArray(currentUser?.savedPosts)
    ? currentUser.savedPosts
    : [],
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
