import { getPostsByTag } from "@/app/actions/blog-admin";
import { getAllTags } from "@/app/actions/blog-public";
import Header from "@/components/header";
import Pagination from "@/components/pagination";
import PostCard from "@/components/post-card";




export async function generateStaticParams() {
  const tags = await getAllTags(); // e.g., [{ name: "tech" }, { name: "health" }]
  return tags.map(tag => ({ name: tag.name }));
}
export default async function TagPage({
  params,
  searchParams,
}: {
  params: { name: string };
  searchParams: { page?: string };
}) {
  const { name } = await params;
  const searchArgs = await searchParams;

  const page = Number(searchArgs.page) || 1;

  const { posts, totalPages, currentPage } = await getPostsByTag(name, page);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": `Posts tagged with "${name}"`,
  "url": `https://nextblog-blogging.vercel.app/blog/tag/${name}`,
  "description": `Browse all articles related to ${name}`,
  "isPartOf": {
    "@type": "Blog",
    "name": "HealthCare Blog",
    "url": "https://nextblog-blogging.vercel.app/blog",
  },
};

  return (
    <>
      <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
      <Header about={name} />
      <div className="flex flex-col gap-6 justify-between h-full min-h-dvh">
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6 my-8">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
            pageUrl={`/blog/tag/${name}`}
          />
        )}
      </div>
    </>
  );
}