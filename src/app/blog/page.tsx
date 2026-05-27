import PostsSkeleton from "@/components/PostsSkeleton";
import dynamic from "next/dynamic";
const PostsWithSearch = dynamic(
  () => import("@/components/PostsWithSearch"),
  { ssr: false, loading: () => <PostsSkeleton rows={6} showControls /> },
);
import { getPosts } from "@/lib/posts";
import { Suspense } from "react";

export const revalidate = 600;

async function BlogPosts() {
  const posts = await getPosts();
  return <PostsWithSearch posts={posts} />;
}

export default function BlogPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my blog.</h1>

      <Suspense fallback={<PostsSkeleton rows={6} showControls />}>
        <BlogPosts />
      </Suspense>
    </article>
  );
}
