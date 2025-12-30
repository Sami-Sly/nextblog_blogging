import { getPublicPosts } from "@/app/actions/blog-public";
import Header from "@/components/header";

import { NavMenu } from "@/components/navbar";
import Pagination from "@/components/pagination";
import PostCard from "@/components/post-card";
import { PublicPost } from "@/components/types/public-post";
import { authSession } from "@/lib/auth-utils";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HealthCare Blog – Trusted Medical Advice on Dermatology, Nutrition & More',
  description: 'Evidence-based health articles on skin care, diabetes, heart health, mental wellness, and nutrition by certified doctors.',
  keywords: ['medical blog', 'health advice', 'dermatology', 'diabetes treatment', 'nutrition tips', 'Nigeria'],
  alternates: {
    canonical: 'https://nextblog-blogging.vercel.app',
  },
  openGraph: {
    title: 'HealthCare Blog – Medical Articles You Can Trust',
    description: 'Professional health guidance on 5 key niches: Dermatology, Endocrinology, Cardiology, Mental Health, and Nutrition.',
    url: 'https://nextblog-blogging.vercel.app',
    siteName: 'HealthCare Blog',
    images: [
      {
        url: 'https://nextblog-blogging.vercel.app/og/home.jpg',
        width: 1200,
        height: 630,
        alt: 'HealthCare Blog – Medical Content for Nigerians',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthCare Blog',
    description: 'Trusted Nigerian medical blog by certified doctors.',
    images: ['/og/home.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
};
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { posts, totalPages, currentPage } = await getPublicPosts(page);
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
    {posts.map((post:PublicPost) => (
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