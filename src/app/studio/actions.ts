"use server";

import { isStudioKey } from "@/lib/studio";
import matter from "gray-matter";
import { z } from "zod";

const PostInput = z.object({
  slug: z
    .string()
    .min(1)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers and dashes.",
    ),
  title: z.string().min(1, "Title is required."),
  summary: z.string().optional(),
  tags: z.array(z.string()).default([]),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  draft: z.boolean().default(false),
  content: z.string().min(1, "Write something first."),
});
export type PostInput = z.input<typeof PostInput>;

type Result = { ok: true } | { ok: false; error: string };

// Posts live as markdown in the repo; saving commits through the GitHub API,
// and the next Vercel deploy publishes it.
async function github(path: string, init?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo)
    throw new Error("GITHUB_TOKEN and GITHUB_REPO must be set.");
  return fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

const branch = () => process.env.GITHUB_BRANCH || "main";
const fileFor = (slug: string) => `content/blog/${slug}.md`;

async function currentSha(slug: string) {
  const res = await github(`${fileFor(slug)}?ref=${branch()}`);
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`GitHub returned ${res.status}.`);
  return (await res.json()).sha as string;
}

export async function savePost(key: string, input: PostInput): Promise<Result> {
  if (!isStudioKey(key)) return { ok: false, error: "Not allowed." };
  const parsed = PostInput.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0].message };
  const { content, slug, ...front } = parsed.data;

  try {
    const sha = await currentSha(slug);
    const body = matter.stringify(`\n${content.trim()}\n`, {
      ...front,
      summary: front.summary || undefined,
      readingTime: `${Math.max(1, Math.round(content.split(/\s+/).length / 220))} min read`,
    });
    const res = await github(fileFor(slug), {
      method: "PUT",
      body: JSON.stringify({
        message: `${sha ? "Update" : "Add"} blog post: ${front.title}`,
        content: Buffer.from(body).toString("base64"),
        branch: branch(),
        sha,
      }),
    });
    if (!res.ok) return { ok: false, error: `GitHub returned ${res.status}.` };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Save failed.",
    };
  }
}

export async function deletePost(key: string, slug: string): Promise<Result> {
  if (!isStudioKey(key)) return { ok: false, error: "Not allowed." };
  try {
    const sha = await currentSha(slug);
    if (!sha) return { ok: false, error: "That post doesn't exist." };
    const res = await github(fileFor(slug), {
      method: "DELETE",
      body: JSON.stringify({
        message: `Delete blog post: ${slug}`,
        sha,
        branch: branch(),
      }),
    });
    if (!res.ok) return { ok: false, error: `GitHub returned ${res.status}.` };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Delete failed.",
    };
  }
}
