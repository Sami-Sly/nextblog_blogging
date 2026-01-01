import { getCategories } from "@/app/actions/categories";
import { getUniquePost } from "@/app/actions/posts";
import PostForm from "@/components/post-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { requireAdmin } from "@/lib/auth-utils";
export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getUniquePost(id);
  const categories = await getCategories();

  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex w-full justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/posts">posts</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {id === "new" ? "New" : post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="p-8 flex flex-col ">
 {post ? (
  <PostForm
    // Core
    id={post.id}
    title={post.title || ""}
    slug={post.slug || ""}
    content={post.content || ""}
    imageUrl={post.imageUrl || ""}
    imageAlt={post.imageAlt || ""}
    categoryId={post.categoryId || ""}
    status={post.status || "draft"}
    categories={categories}
    
    // Tags & Taxonomy (normalize string[] → {label, value}[])
    tags={(post.tags || []).map(tag => ({ label: tag, value: tag }))}
    medicalConditions={(post.medicalConditions || []).map(mc => ({ label: mc, value: mc }))}
    symptoms={(post.symptoms || []).map(s => ({ label: s, value: s }))}
    treatments={(post.treatments || []).map(t => ({ label: t, value: t }))}
    medications={(post.medications || []).map(m => ({ label: m, value: m }))}
    citations={(post.citations || []).map(c => ({ label: c, value: c }))}

    // SEO
    seoTitle={post.seoTitle || post.title || ""}
    seoDescription={post.seoDescription || ""}
    canonicalUrl={post.canonicalUrl || ""}
    primaryKeyword={post.primaryKeyword || ""}
    ogImage={post.ogImage || post.imageUrl || ""}
    noIndex={post.noIndex ?? false}

    // Author & Dates
    author={post.author || ""}
    authorCredentials={post.authorCredentials || ""}
    authorProfileUrl={post.authorProfileUrl || ""}
    authorExperienceYrs={post.authorExperienceYrs ?? undefined}
    datePublished={post.datePublished ? new Date(post.datePublished) : undefined}
    dateModified={post.dateModified ? new Date(post.dateModified) : undefined}
    readingTime={post.readingTime ?? undefined}

    // Medical Review
    reviewedBy={post.reviewedBy || ""}
    reviewerCredentials={post.reviewerCredentials || ""}
    medicalReviewDate={post.medicalReviewDate ? new Date(post.medicalReviewDate) : undefined}

    // Medical Entity Graph
    mainEntity={post.mainEntity || ""}
    medicalSpecialty={post.medicalSpecialty || ""}

    // Freshness / Core Update Shield
    lastMedicalUpdate={post.lastMedicalUpdate ? new Date(post.lastMedicalUpdate) : undefined}
    contentVersion={post.contentVersion || ""}

    // Intent & Trust
    intent={post.intent || ""}
    editorialPolicyUrl={post.editorialPolicyUrl || ""}
    medicalBoardUrl={post.medicalBoardUrl || ""}
    hasDisclaimer={post.hasDisclaimer ?? true}
    riskLevel={post.riskLevel || ""}

    // Publisher / Organization Authority
    publisherName={post.publisherName || ""}
    publisherUrl={post.publisherUrl || ""}
    publisherLogoUrl={post.publisherLogoUrl || ""}

    // Audience
    targetAudience={post.targetAudience || ""}
  />
) : (
  <PostForm
    // Core
    id=""
    title=""
    slug=""
    content=""
    imageUrl=""
    imageAlt=""
    categoryId=""
    status="draft"
    categories={categories}
    
    // Tags & Taxonomy
    tags={[]}
    medicalConditions={[]}
    symptoms={[]}
    treatments={[]}
    medications={[]}
    citations={[]}

    // SEO
    seoTitle=""
    seoDescription=""
    canonicalUrl=""
    primaryKeyword=""
    ogImage=""
    noIndex={false}

    // Author & Dates
    author=""
    authorCredentials=""
    authorProfileUrl=""
    authorExperienceYrs={undefined}
    datePublished={undefined}
    dateModified={undefined}
    readingTime={undefined}

    // Medical Review
    reviewedBy=""
    reviewerCredentials=""
    medicalReviewDate={undefined}

    // Medical Entity Graph
    mainEntity=""
    medicalSpecialty=""

    // Freshness
    lastMedicalUpdate={undefined}
    contentVersion=""

    // Intent & Trust
    intent=""
    editorialPolicyUrl=""
    medicalBoardUrl=""
    hasDisclaimer={true}
    riskLevel=""

    // Publisher
    publisherName=""
    publisherUrl=""
    publisherLogoUrl=""

    // Audience
    targetAudience=""
  />
)}
</div>

    </>
  );
}