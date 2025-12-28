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

  return (
    <>
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