import { BlogSkeleton } from "@/components/blog-skeleton";

export default function Loading() {
  return (
    // bg-background is the shadcn variable that changes from white to black
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      
      {/* Page Title Placeholder */}
      <div className="mb-10 space-y-4">
        {/* Use bg-muted for the main skeleton blocks */}
        <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-muted/50 rounded animate-pulse" />
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
