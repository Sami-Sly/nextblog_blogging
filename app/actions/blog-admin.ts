"use server";

import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";

const PAGE_SIZE = 10;

// Get paginated posts for admin dashboard
export const getPosts = async (page: number) => {
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
        skip,
        take: PAGE_SIZE,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { image: true, name: true, id: true, savedPosts: true } },
          category: true,
        },
      }),
      prisma.post.count(),
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
