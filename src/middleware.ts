import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // If `/resume.pdf` is requested with an RSC query param, strip it
  // so the static file in `public/` is served instead of returning 404.
  if (url.pathname === "/resume.pdf" && url.searchParams.has("_rsc")) {
    url.searchParams.delete("_rsc");
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/resume.pdf"],
};
