import { updatePostViews } from "@/app/actions/blog";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await updatePostViews(params.id);
  return Response.json({ ok: true });
}
