import { getBlogPostBySlug} from "@/app/actions/blog-public";
import { getAllPosts, getPublicPostsForSSG } from "@/app/actions/posts";
import RichTextViewer from "@/components/rich-text-viewer";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";


export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublicPostsForSSG(100);

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);
   if (!post) return <div>Post not found</div>; // avoids 404


  return (
    <div className="w-full mt-6 flex justify-center px-4">
      <article className="w-full max-w-6xl flex flex-col gap-4">
        {/* Title */}
        <h1 className="text-2xl md:text-5xl font-semibold leading-tight">
          {post.title}
        </h1>

        {/* Meta: date + author */}
        <div className="lg:text-md text-sm text-neutral-500">
          {format(post.createdAt, "MMMM dd, yyyy")} · by{" "}
          <span className="font-medium text-neutral-700">Amna</span>
        </div>

        {/* Cover image */}
        <div className="relative h-80 w-full">
          <Image
            src={post.imageUrl!}
            alt={post.title}
            fill
            className="object-cover rounded-sm"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Content */}
        <RichTextViewer content={post.content} />

        {/* Tags */}
        <div className="flex gap-2 pt-6 flex-wrap">
          {post.tags.map((tag) => (
            <Link href={`/blog/tag/${tag}`} key={tag}>
              <Badge variant="secondary">#{tag}</Badge>
            </Link>
          ))}
        </div>
      </article>
    </div>
  );
}
