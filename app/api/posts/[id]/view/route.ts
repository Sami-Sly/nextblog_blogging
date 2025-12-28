// app/api/posts/[id]/view/route.ts
import { updatePostViews } from "@/app/actions/blog";

export async function POST(
  request: Request, // or NextRequest
  { params }: { params: { id: string } } // resolved, not a Promise
) {
  await updatePostViews(params.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
