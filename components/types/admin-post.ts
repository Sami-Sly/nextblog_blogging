// types/admin-post.ts
// import { PostStatus } from "@prisma/client";
import { PostStatus } from "@/lib/generated/prisma/client";

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  imageAlt: string | null;
  views: number;
  tags: string[];
  status: PostStatus;
  userId: string;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  seoTitle: string | null;
  seoDescription: string | null;
  author: string | null;
  readingTime: number | null;
  noIndex: boolean;
  category: { id: string; name: string } | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    savedPosts: string[];
  } | null;
  savedPosts: string[]; // current user's saved posts
};