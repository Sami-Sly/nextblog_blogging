"use client";

import { Category, Post } from "@/lib/generated/prisma/client";
import { stripHtml } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";

interface PostProps {
  post: Post & { category: Category | null } & {
    user: {
      name: string;
      id: string;
      image: string | null;
      savedPosts: string[];
    };
  };
}

export default function PostCard({ post }: PostProps) {
  const excerpt = stripHtml(post.content);

  return (
    <Link
      href={`/blog/posts/${post.slug}`}
      className="block group transition-all duration-200 hover:shadow-lg hover:scale-[1.01] focus:outline-none"
    >
      <Card className="w-full border shadow-sm rounded-xl overflow-hidden p-0 gap-0">
        {/* Responsive Image */}
         {/* 1. Image Container - Fixed height removed, AspectRatio handles it */}
        <div className="w-full overflow-hidden rounded-md border bg-muted shadow-sm">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={post?.imageUrl || "/placeholder.jpg"}
              alt={post?.title}
                    fill // Required: Disables lazy-loading and adds preload tag
        fetchPriority="high" // Optional but recommended: Boosts fetch priority
              className="object-cover "
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </AspectRatio>
        </div>

        {/* Title */}
        <CardHeader className="p-4 pt-3 pb-1">
          <CardTitle className="text-xl font-bold text-foreground line-clamp-2 leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>

        {/* Excerpt + Date */}
        <CardContent className="p-4 pt-0 pb-4">
          <p className="text-base text-muted-foreground line-clamp-3 mb-2 leading-relaxed">
            {excerpt}
          </p>
          <span className="text-sm text-muted-foreground font-medium">
            {format(post.createdAt, "dd/MM/yyyy")} by Amna
          </span>
        </CardContent>
      </Card>
    </Link>
  );
} 