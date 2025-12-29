import { getBlogPostBySlug} from "@/app/actions/blog-public";
import { getAllPosts, getPublicPostsForSSG } from "@/app/actions/posts";
import RichTextViewer from "@/components/rich-text-viewer";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { notFound } from "next/dist/client/components/navigation";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublicPostsForSSG(20);

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const resolvedParams = await params; // unwrap Promise
  const slug = resolvedParams.slug;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();

  const url = `https://nextblog-blogging.vercel.app/blog/${post.slug}`;

  const description =

    post.content?.slice(0, 155).replace(/<[^>]*>?/gm, "") ||
    post.title;

  return {
    title: `${post.title} – Symptoms, Causes & Treatment`,
    description,
    alternates: { canonical: url },

    openGraph: {
      type: "article",
      title: post.title,
      description,
      url,
      siteName: "HealthCare Blog",
      publishedTime: post.createdAt.toISOString(),
      authors: ["Dr. Ahmed Khan, MBBS"],
      images: [
        {
          url: post.imageUrl || "/og/default.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.imageUrl || "/og/default.jpg"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  

  const post = await getBlogPostBySlug(slug);
   if (!post) return <div>Post not found</div>; // avoids 404

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": post.title,
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt || post.createdAt,
    "author": {
      "@type": "Person",
      "name": "Dr. Amna Umer MMBS",
      "medicalSpecialty": "Dermatology"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HealthCare Blog",
      "url": "https://nextblog-blogging.vercel.app"
    },
    "mainEntity": {
      "@type": "MedicalCondition",
      "name": post.title
    }
  };

  return (
    <div className="w-full mt-6 flex justify-center px-4">
      <article className="w-full max-w-6xl flex flex-col gap-4">

          {/* STRUCTURED DATA */}
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
 src={`${post.imageUrl}?v=${post.updatedAt.getTime()}`}
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
