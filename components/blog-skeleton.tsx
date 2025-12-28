// components/blog-skeleton.tsx
export const BlogSkeleton = () => (
  <div className="flex flex-col gap-4 border border-border rounded-xl p-4 shadow-sm bg-card">
    {/* Image area: bg-muted/50 gives a subtle look */}
    <div className="w-full aspect-video bg-muted/50 rounded-lg animate-pulse" />
    
    <div className="space-y-3">
      {/* Category/Badge */}
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
      
      {/* Title */}
      <div className="h-6 w-full bg-muted rounded animate-pulse" />
      <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
      
      {/* Excerpt */}
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full bg-muted/60 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-muted/60 rounded animate-pulse" />
      </div>
    </div>
  </div>
);
