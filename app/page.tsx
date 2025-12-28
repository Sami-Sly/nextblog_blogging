import { getPosts } from "@/app/actions/blog";
import Header from "@/components/header";

import { NavMenu } from "@/components/navbar";
import Pagination from "@/components/pagination";
import PostCard from "@/components/post-card";
import { authSession } from "@/lib/auth-utils";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, totalPages, currentPage } = await getPosts(page);
  const session = await authSession();

  return (
    <>
      <div className="relative z-10 w-full">
        <NavMenu
          userName={session?.user.name}
          userImage={session?.user.image as string}
        />
      </div>
      <Header />
      <div className="flex flex-col gap-6 justify-center">
   <div className="mx-auto max-w-[1200px] px-4 py-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
    {posts.map((post) => (
      <PostCard post={post} key={post.id} />
    ))}
  </div>
</div>
        {posts.length > 0 && (
          <Pagination
            page={page}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
}