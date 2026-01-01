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


export const createPost = async (params: PostFormValues) => {
  try {
    const session = await authSession();
    if (!session) throw new Error("Unauthorized: User not found");

    const {
      id,
      categories,
      tags,
      medicalConditions,
      symptoms,
      treatments,
      medications,
      citations,
      ...rest
    } = params;

    // Map all array fields safely
    const mappedData = {
      tags: tags?.map(t => t.value) ?? [],
      medicalConditions: medicalConditions?.map(t => t.value) ?? [],
      symptoms: symptoms?.map(t => t.value) ?? [],
      treatments: treatments?.map(t => t.value) ?? [],
      medications: medications?.map(t => t.value) ?? [],
      citations: citations?.map(t => t.value) ?? [],
    };

    const data = {
      ...rest,
      ...mappedData,

      // Core relations
      userId: session.user.id,
      status: rest.status as PostStatus,
      categoryId: rest.categoryId || null,

      // Author & Dates
      author: rest.author ?? null,
      authorCredentials: rest.authorCredentials ?? null,
      authorProfileUrl: rest.authorProfileUrl ?? null,
      authorExperienceYrs: rest.authorExperienceYrs ?? null,
      datePublished: rest.datePublished ?? new Date(),
      dateModified: rest.dateModified ?? undefined,
      readingTime: rest.readingTime ?? null,

      // Medical Review Layer
      reviewedBy: rest.reviewedBy ?? null,
      reviewerCredentials: rest.reviewerCredentials ?? null,
      medicalReviewDate: rest.medicalReviewDate ?? null,

      // Medical Entity Graph
      mainEntity: rest.mainEntity ?? null,
      medicalSpecialty: rest.medicalSpecialty ?? null,

      // Freshness / Core Update Shield
      lastMedicalUpdate: rest.lastMedicalUpdate ?? null,
      contentVersion: rest.contentVersion ?? null,

      // Intent & Trust
      intent: rest.intent ?? null,
      editorialPolicyUrl: rest.editorialPolicyUrl ?? null,
      medicalBoardUrl: rest.medicalBoardUrl ?? null,
      hasDisclaimer: rest.hasDisclaimer ?? true,
      riskLevel: rest.riskLevel ?? null,

      // Publisher / Organization Authority
      publisherName: rest.publisherName ?? null,
      publisherUrl: rest.publisherUrl ?? null,
      publisherLogoUrl: rest.publisherLogoUrl ?? null,

      // Audience
      targetAudience: rest.targetAudience ?? null,

      // SEO Control
      seoTitle: rest.seoTitle ?? rest.title,
      seoDescription: rest.seoDescription ?? "",
      canonicalUrl: rest.canonicalUrl ?? `https://nextblog-blogging.vercel.app/blog/${rest.slug}`,
      primaryKeyword: rest.primaryKeyword ?? null,
      ogImage: rest.ogImage ?? rest.imageUrl,
      noIndex: rest.noIndex ?? false,
    };

    const newPost = await prisma.post.create({ data });
    return newPost;
  } catch (err) {
    console.error("Create post error:", err);
    throw new Error("Failed to create post");
  }
};
export const updatePost = async (params: PostFormValues) => {
  try {
    const session = await authSession();
    if (!session) throw new Error("Unauthorized");

    const {
      id,
      categories,
      tags,
      medicalConditions,
      symptoms,
      treatments,
      medications,
      citations,
      ...rest
    } = params;

    if (!id) throw new Error("Post ID is required for update");

    const data: any = {
      ...rest,

      // Arrays: always send array (even empty)
      tags: tags?.map(t => t.value) ?? [],
      medicalConditions: medicalConditions?.map(t => t.value) ?? [],
      symptoms: symptoms?.map(t => t.value) ?? [],
      treatments: treatments?.map(t => t.value) ?? [],
      medications: medications?.map(t => t.value) ?? [],
      citations: citations?.map(t => t.value) ?? [],

      // Optional strings: send null to clear
      author: rest.author ?? undefined,
      authorCredentials: rest.authorCredentials ?? undefined,
      authorProfileUrl: rest.authorProfileUrl ?? undefined,
      reviewedBy: rest.reviewedBy ?? undefined,
      reviewerCredentials: rest.reviewerCredentials ?? undefined,
      mainEntity: rest.mainEntity ?? undefined,
      medicalSpecialty: rest.medicalSpecialty ?? undefined,
      intent: rest.intent ?? undefined,
      editorialPolicyUrl: rest.editorialPolicyUrl ?? undefined,
      medicalBoardUrl: rest.medicalBoardUrl ?? undefined,
      riskLevel: rest.riskLevel ?? undefined,
      publisherName: rest.publisherName ?? undefined,
      publisherUrl: rest.publisherUrl ?? undefined,
      publisherLogoUrl: rest.publisherLogoUrl ?? undefined,
      targetAudience: rest.targetAudience ?? undefined,
      primaryKeyword: rest.primaryKeyword ?? undefined,
      ogImage: rest.ogImage ?? undefined,
      seoTitle: rest.seoTitle ?? undefined,
      seoDescription: rest.seoDescription ?? undefined,
      canonicalUrl: rest.canonicalUrl ?? undefined,
      noIndex: rest.noIndex ?? undefined,
      readingTime: rest.readingTime ?? undefined,
      contentVersion: rest.contentVersion ?? undefined,
      hasDisclaimer: rest.hasDisclaimer ?? undefined,

      // Dates: only send if defined
      datePublished: rest.datePublished ?? undefined,
      dateModified: new Date(),
      medicalReviewDate: rest.medicalReviewDate ?? undefined,
      lastMedicalUpdate: rest.lastMedicalUpdate ?? undefined,

      // Core relations
      userId: session.user.id,
      status: rest.status as PostStatus,
      categoryId: rest.categoryId ?? undefined,
    };

    const updatedPost = await prisma.post.update({
      where: { id },
      data,
    });

    return updatedPost;
  } catch (err) {
    console.error("Update post error:", err);
    throw new Error("Failed to update post");
  }
};
//     const updatedPost = await prisma.post.update({
//       where: { id },
//       data,
//     });

//     return updatedPost;
//   } catch (err) {
//     console.error("Update post error:", err);
//     throw new Error("Failed to update post");
//   }
// };
// export const createPost = async (params: PostFormValues) => {
//   try {
//     const session = await authSession();

//     if (!session) {
//       throw new Error("Unauthorized: User Id not found");
//     }

//     const { categories, tags, id, ...rest } = params;

//     const data = {
//       ...rest,
//       tags: tags?.map((tag) => tag.value) ?? [],
//     };

//     const res = await prisma.post.create({
//       data: {
//         ...data,
//         status: data.status as PostStatus,
//         userId: session.user.id,
//         // All optional fields explicitly passed
//         imageAlt: data.imageAlt ?? null,
//         seoTitle: data.seoTitle ?? null,
//         seoDescription: data.seoDescription ?? null,
//         canonicalUrl: data.canonicalUrl ?? null,
//         primaryKeyword: data.primaryKeyword ?? null,
//         ogImage: data.ogImage ?? null,
//         author: data.author ?? null,
//         datePublished: data.datePublished ?? undefined,
//         dateModified: data.dateModified ?? undefined,
//         readingTime: data.readingTime ?? null,
//         noIndex: data.noIndex ?? false,
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

//     const data = {
//       ...rest,
//       tags: tags?.map((tag) => tag.value) ?? [],
//     };

//     const post = await prisma.post.update({
//       where: { id },
//       data: {
//         ...data,
//         userId: session.user.id,
//         status: data.status as PostStatus,
//         // All optional fields explicitly passed
//         imageAlt: data.imageAlt ?? null,
//         seoTitle: data.seoTitle ?? null,
//         seoDescription: data.seoDescription ?? null,
//         canonicalUrl: data.canonicalUrl ?? null,
//         primaryKeyword: data.primaryKeyword ?? null,
//         ogImage: data.ogImage ?? null,
//         author: data.author ?? null,
//         datePublished: data.datePublished ?? undefined,
//         dateModified: data.dateModified ?? undefined,
//         readingTime: data.readingTime ?? null,
//         noIndex: data.noIndex ?? false,
//       },
//       select: {
//         slug: true,
//       },
//     });

//     // Revalidate paths if needed
//     revalidatePath(`/blog/posts/${post.slug}`);
//     revalidatePath(`/blog`);
//     revalidatePath(`/`);

//     return post;
//   } catch (err) {
//     console.error(err);
//     throw new Error("Something went wrong");
//   }
// };



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

export const getPublicPostsForSSG = async (limit = 20) => {
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
