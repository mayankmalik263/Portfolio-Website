import StudioEditor from "@/components/StudioEditor";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { isStudioKey } from "@/lib/studio";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default async function StudioPage({
  params,
}: {
  params: { key: string };
}) {
  // Wrong or missing key looks exactly like a page that doesn't exist.
  if (!isStudioKey(params.key)) notFound();

  const summaries = await getPosts();
  const posts = (
    await Promise.all(summaries.map((p) => getPostBySlug(p.slug)))
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <article className="mt-8 flex flex-col gap-6 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="title">studio.</h1>
        <p className="text-muted-foreground">
          Write, edit or delete posts. Saving commits to GitHub; the post goes
          live after the next deploy, usually within a couple of minutes.
        </p>
      </div>
      <StudioEditor studioKey={params.key} posts={posts} />
    </article>
  );
}
