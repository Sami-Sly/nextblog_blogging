import { NextRequest, NextResponse } from "next/server";

// Update the type definition: params is now a Promise
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  // You MUST await params in Next.js 15
  const { id } = await params;

  try {
    // Your logic here, for example:
    // await db.post.update({ where: { id }, data: { ... } })

    return NextResponse.json({ message: "View updated", id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
