"use server";

import prisma from "@/lib/db";
import { PostStatus } from "@/lib/generated/prisma/client";

type SearchResult =
  | {
      type: "post";
      id: string;
      title: string;
      url: string;
      imageUrl: string;
    }
  | {
      type: "category";
      id: string;
      name: string;
      url: string;
    };

type PostSelect = {
  id: string;
  title: string;
  imageUrl: string;
  slug: string;
};

type CategorySelect = {
  id: string;
  name: string;
};

export async function searchContent(query: string) {
  if (query.trim().length < 2) {
    return { results: [] };
  }

  try {
    const [posts, categories] = await Promise.all([
      prisma.post.findMany({
        where: {
          status: PostStatus.published,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query] } },
          ],
        },
        select: { id: true, title: true, imageUrl: true, slug: true },
        take: 10,
        orderBy: { updatedAt: "desc" },
      }) as Promise<PostSelect[]>,

      prisma.category.findMany({
        where: {
          name: { contains: query, mode: "insensitive" },
        },
        select: { id: true, name: true },
        take: 10,
        orderBy: { updatedAt: "desc" },
      }) as Promise<CategorySelect[]>,
    ]);

    const results: SearchResult[] = [
      ...posts.map((post: PostSelect) => ({
        type: "post" as const,
        title: post.title,
        url: `/blog/posts/${post.slug}`,
        imageUrl: post.imageUrl,
        id: post.id,
      })),

      ...categories.map((category: CategorySelect) => ({
        type: "category" as const,
        name: category.name,
        url: `/blog/category/${category.id}`,
        id: category.id,
      })),
    ];

    return { results };
  } catch (err) {
    console.error({ err });
    return { results: [] };
  }
}
