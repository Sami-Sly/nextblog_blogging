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
    if (!session) {
      throw new Error("Unauthorized: User not found");
    }



    
const {
  categories,
  tags,
  medicalConditions,
  symptoms,
  treatments,
  medications,
  citations,
  id,
  ...rest
} = params;

const data = {
  ...rest,
  // Extract .value from all creatable select arrays
  tags: tags?.map(t => t.value) ?? [],
  medicalConditions: medicalConditions?.map(t => t.value) ?? [],
  symptoms: symptoms?.map(t => t.value) ?? [],
  treatments: treatments?.map(t => t.value) ?? [],
  medications: medications?.map(t => t.value) ?? [],
  citations: citations?.map(t => t.value) ?? [],
};

    const newPost = await prisma.post.create({
      data: {
        ...data,
        userId: session.user.id,
        status: data.status as PostStatus,
        categoryId: data.categoryId || null,
        imageAlt: data.imageAlt ?? null,






        // Author & Dates
        author: data.author ?? null,
        authorCredentials: data.authorCredentials ?? null,
        authorProfileUrl: data.authorProfileUrl ?? null,
        authorExperienceYrs: data.authorExperienceYrs ?? null,
        datePublished: data.datePublished ?? new Date(), // auto-set if not provided
        readingTime: data.readingTime ?? null,
        dateModified: data.dateModified ?? undefined,


        // Medical Review Layer
        reviewedBy: data.reviewedBy ?? null,
        reviewerCredentials: data.reviewerCredentials ?? null,
        medicalReviewDate: data.medicalReviewDate ?? null,

        // Medical Entity Graph
        mainEntity: data.mainEntity ?? null,
        medicalSpecialty: data.medicalSpecialty ?? null,

        // Freshness
        lastMedicalUpdate: data.lastMedicalUpdate ?? null,
        contentVersion: data.contentVersion ?? null,

        // Intent & Trust
        intent: data.intent ?? null,
        editorialPolicyUrl: data.editorialPolicyUrl ?? null,
        medicalBoardUrl: data.medicalBoardUrl ?? null,
        hasDisclaimer: data.hasDisclaimer ?? true,
        riskLevel: data.riskLevel ?? null,

        // Publisher
        publisherName: data.publisherName ?? null,
        publisherUrl: data.publisherUrl ?? null,
        publisherLogoUrl: data.publisherLogoUrl ?? null,

        // Audience
        targetAudience: data.targetAudience ?? null,

        // SEO Core (already in rest, but ensure non-null where required)
        seoTitle: data.seoTitle ?? data.title, // fallback to title
        seoDescription: data.seoDescription ?? "",
        canonicalUrl: data.canonicalUrl ?? `https://nextblog-blogging.vercel.app/blog/${data.slug}`,
        primaryKeyword: data.primaryKeyword ?? null,
        ogImage: data.ogImage ?? data.imageUrl, // fallback to hero image
        noIndex: data.noIndex ?? false,
      },
    });

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
  categories,
  tags,
  medicalConditions,
  symptoms,
  treatments,
  medications,
  citations,
  id,
  ...rest
} = params;

const data = {
  ...rest,
  // Extract .value from all creatable select arrays
  tags: tags?.map(t => t.value) ?? [],
  medicalConditions: medicalConditions?.map(t => t.value) ?? [],
  symptoms: symptoms?.map(t => t.value) ?? [],
  treatments: treatments?.map(t => t.value) ?? [],
  medications: medications?.map(t => t.value) ?? [],
  citations: citations?.map(t => t.value) ?? [],
};

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...data,
        userId: session.user.id,
        status: data.status as PostStatus,
        categoryId: data.categoryId || null,

        // Author & Dates
        author: data.author ?? undefined,
        authorCredentials: data.authorCredentials ?? undefined,
        authorProfileUrl: data.authorProfileUrl ?? undefined,
        authorExperienceYrs: data.authorExperienceYrs ?? undefined,
        readingTime: data.readingTime ?? undefined,

        // Medical Review Layer
        reviewedBy: data.reviewedBy ?? undefined,
        reviewerCredentials: data.reviewerCredentials ?? undefined,
        medicalReviewDate: data.medicalReviewDate ?? undefined,

        // Medical Entity Graph
        mainEntity: data.mainEntity ?? undefined,
        medicalSpecialty: data.medicalSpecialty ?? undefined,

        // Freshness
        lastMedicalUpdate: data.lastMedicalUpdate ?? undefined,
        contentVersion: data.contentVersion ?? undefined,

        // Intent & Trust
        intent: data.intent ?? undefined,
        editorialPolicyUrl: data.editorialPolicyUrl ?? undefined,
        medicalBoardUrl: data.medicalBoardUrl ?? undefined,
        hasDisclaimer: data.hasDisclaimer ?? true,
        riskLevel: data.riskLevel ?? undefined,

        // Publisher
        publisherName: data.publisherName ?? undefined,
        publisherUrl: data.publisherUrl ?? undefined,
        publisherLogoUrl: data.publisherLogoUrl ?? undefined,

        // Audience
        targetAudience: data.targetAudience ?? undefined,

        // SEO (keep existing if not provided)
        seoTitle: data.seoTitle ?? undefined,
        seoDescription: data.seoDescription ?? undefined,
        canonicalUrl: data.canonicalUrl ?? undefined,
        primaryKeyword: data.primaryKeyword ?? undefined,
        ogImage: data.ogImage ?? undefined,
        noIndex: data.noIndex ?? undefined,
      },
      select: { slug: true },
    });

    // Revalidate affected paths
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath(`/blog`);
    revalidatePath(`/`);
    revalidatePath(`/blog/category/*`); // or specific category if known
    revalidatePath(`/blog/tag/*`);

    return updatedPost;
  } catch (err) {
    console.error("Update post error:", err);
    throw new Error("Failed to update post");
  }
};

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
