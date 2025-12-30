"use server";

import { PostFormValues } from "@/components/post-form";
import { authSession } from "@/lib/auth-utils";
import prisma from "@/lib/db";
import { Post, PostStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";



export const getUniquePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = (await prisma.post.findUnique({ where: { id } })) as Post;

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

// export const createPost = async (params: PostFormValues) => {
//   try {
//     const session = await authSession();

//     if (!session) {
//       throw new Error("Unauthorized: User Id not found");
//     }

//     const { categories, tags, id, ...rest } = params;
//     const data = { ...rest, tags: tags.map((tag) => tag.value) };

//     const res = await prisma.post.create({
//       data: {
//         ...data,
//         status: data.status as PostStatus,
//         userId: session.user.id,
//       },
//     });

//     return res;
//   } catch (err) {
//     console.error({ err });
//     throw new Error("Something went wrong");
//   }
// };

// export const updatePost = async (params: PostFormValues) => {
//   try {
//     const session = await authSession();
//     if (!session) throw new Error("Unauthorized");

//     const { categories, tags, id, ...rest } = params;
//     const data = { ...rest, tags: tags.map(tag => tag.value) };

//     const post = await prisma.post.update({
//       where: { id },
//       data: {
//         ...data,
//         userId: session.user.id,
//         status: data.status as PostStatus,
//       },
//       select: {
//         slug: true,
//       },
//     });

//     // ✅ Now slug exists
//     revalidatePath(`/blog/posts/${post.slug}`);
//     revalidatePath(`/blog`);
//     revalidatePath(`/`);

//     return post;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Something went wrong");
//   }
// };



export const createPost = async (params: PostFormValues) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const { categories, tags, id, ...rest } = params;

    const data = {
      ...rest,
      tags: tags?.map((tag) => tag.value) ?? [],
    };

    const res = await prisma.post.create({
      data: {
        ...data,
        status: data.status as PostStatus,
        userId: session.user.id,
        // All optional fields explicitly passed
        imageAlt: data.imageAlt ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        canonicalUrl: data.canonicalUrl ?? null,
        primaryKeyword: data.primaryKeyword ?? null,
        ogImage: data.ogImage ?? null,
        author: data.author ?? null,
        datePublished: data.datePublished ?? undefined,
        dateModified: data.dateModified ?? undefined,
        readingTime: data.readingTime ?? null,
        noIndex: data.noIndex ?? false,
      },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const updatePost = async (params: PostFormValues) => {
  try {
    const session = await authSession();
    if (!session) throw new Error("Unauthorized");

    const { categories, tags, id, ...rest } = params;

    const data = {
      ...rest,
      tags: tags?.map((tag) => tag.value) ?? [],
    };

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        userId: session.user.id,
        status: data.status as PostStatus,
        // All optional fields explicitly passed
        imageAlt: data.imageAlt ?? null,
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        canonicalUrl: data.canonicalUrl ?? null,
        primaryKeyword: data.primaryKeyword ?? null,
        ogImage: data.ogImage ?? null,
        author: data.author ?? null,
        datePublished: data.datePublished ?? undefined,
        dateModified: data.dateModified ?? undefined,
        readingTime: data.readingTime ?? null,
        noIndex: data.noIndex ?? false,
      },
      select: {
        slug: true,
      },
    });

    // Revalidate paths if needed
    revalidatePath(`/blog/posts/${post.slug}`);
    revalidatePath(`/blog`);
    revalidatePath(`/`);

    return post;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};



export const getAllPosts = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

// export const getPublicPostsForSSG = async (limit = 100) => {
//   return prisma.post.findMany({
//     where: {
//       status: "published",
//     },
//     select: {
//       slug: true,
//     },
//     orderBy: {
//       createdAt: "desc", // or views: "desc"
//     },
//     take: limit,
//   });
// };

export const removePost = async (id: string) => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.delete({
      where: { id },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const getPostsByUser = async () => {
  try {
    const session = await authSession();

    if (!session) {
      throw new Error("Unauthorized: User Id not found");
    }

    const res = await prisma.post.findMany({
      take: 10,
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });

    return res;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export const getPublicPostsForSSG = async (limit = 100) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true, // add this
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return posts;
  } catch (err) {
    console.error({ err });
    throw new Error("Something went wrong");
  }
};

export async function getAllCategoriesStatic() {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}