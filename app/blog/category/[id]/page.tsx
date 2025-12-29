import { getPostsByCategory } from "@/app/actions/blog-admin";
import { getAllCategories } from "@/app/actions/blog-public";
import Header from "@/components/header";
import Pagination from "@/components/pagination";
import PostCard from "@/components/post-card";

export const revalidate = 3600; // ISR: revalidate every 1 hour

// Pre-build category pages for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories(); // [{ id: "tech" }, { id: "health" }, ...]
  return categories.map((cat) => ({
    id: cat.id,
  }));
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const { id } = await params;
  const searchArgs = await searchParams;

  const page = Number(searchArgs.page) || 1;

  const { posts, totalPages, currentPage } = await getPostsByCategory(id, page);

  const foundPost = posts.find((post) => post.categoryId === id);
  const categoryName = foundPost?.categoryId === id ? id : undefined;
  // ✅ Correct JSON-LD for category page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Articles in ${id} category`,
    "description": `Browse all articles under the ${id} category`,
    "url": `https://nextblog-blogging.vercel.app/blog/category/${id}`,
    "isPartOf": {
      "@type": "Blog",
      "name": "HealthCare Blog",
      "url": "https://nextblog-blogging.vercel.app/blog",
    },
  };
  return (
    <>
      {/* SEO: Category Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

    <div className="mt-6">

      <Header  about={categoryName} />
    </div>
      <div className="flex flex-col gap-6 mt-4 justify-between h-full min-h-dvh">
        <div className="container mx-auto p-4 grid grid-cols-1   md:grid-cols-3 gap-6 my-8">
          {posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
            pageUrl={`/blog/category/${id}`}
          />
        )}
      </div>
    </>
  );
}