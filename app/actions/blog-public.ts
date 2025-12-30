"use server";

import prisma from "@/lib/db";
export async function getAllPublicPostsSlugs() {
  // Return only { slug } for all published posts
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: { slug: true }
  });
  return posts;
}
// // Get a single blog post by slug (safe for SSG)

// export const getBlogPostBySlug = async (slug: string) => {
//   try {
//     const post = await prisma.post.findUnique({
//       where: { slug },
//       include: {
//         user: { select: { name: true, image: true, id: true } },
//         category: true,
//       },
//     });
//     return post;
//   } catch (err) {
//     console.error({ err });
//     throw new Error("Something went wrong");
//   }
// };

// app/actions/blog-public.ts
export const getBlogPostBySlug = async (slug: string) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
     include: {
        user: { select: { name: true, image: true, id: true } },
        category: true,
      },
    });

    if (!post) {
      console.warn(`Post not found for slug: ${slug}`);
      return null; // important for ISR + BlogPage
    }

    return post;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error in getBlogPostBySlug:", err.message, err.stack);
    } else {
      console.error("Unknown error in getBlogPostBySlug:", err);
    }
    return null; // prevents ISR or page crash
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
export const getPublicPostsForSSG = async (limit = 20) => {
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



// e.g., in app/actions/blog-public.ts
const PAGE_SIZE = 9;
// app/actions/blog-public.ts

export const getPublicPosts = async (page: number = 1) => {
  const skip = (page - 1) * PAGE_SIZE;

  try {
    // ✅ Run queries in parallel — no transaction needed!
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: "published",
        },
        skip,
        take: PAGE_SIZE,
        orderBy: { datePublished: "desc" },
        include: {
          user: {
            select: { name: true, image: true },
          },
          category: true,
        },
      }),
      prisma.post.count({
        where: { status: "published" },
      }),
    ]);

    const safePosts = posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      title: post.title ?? "",
      slug: post.slug ?? "",
      content: post.content ? post.content.substring(0, 200) + "..." : "",
      imageUrl: post.imageUrl ?? "",
      imageAlt: post.imageAlt ?? null,
      views: post.views ?? 0,
      tags: Array.isArray(post.tags) ? post.tags : [],
      status: post.status,
      categoryId: post.categoryId ?? null,
      category: post.category ?? null,
      user: post.user ?? null,
      seoTitle: post.seoTitle ?? post.title,
      seoDescription: post.seoDescription ?? "",
      canonicalUrl: post.canonicalUrl ?? null,
      primaryKeyword: post.primaryKeyword ?? null,
      ogImage: post.ogImage ?? post.imageUrl ?? null,
      author: post.author ?? post.user?.name ?? null,
      datePublished: post.datePublished ?? post.createdAt,
      dateModified: post.dateModified ?? post.updatedAt,
      readingTime: post.readingTime ?? null,
      noIndex: post.noIndex ?? false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return {
      posts: safePosts,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
      currentPage: page,
    };
  } catch (err) {
    console.error("getPublicPosts error:", err);
    throw new Error("Failed to load posts");
  }
};