import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  // Without a backend, we fallback to 0 views or handle it with an alternative database later.
  return NextResponse.json({ views: 0 });
}
