"use client";

import { deletePost, savePost } from "@/app/studio/actions";
import type { PostDetail } from "@/lib/posts";
import { Eye, PenLine, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Draft = {
  slug: string;
  title: string;
  summary: string;
  tags: string;
  publishedAt: string;
  draft: boolean;
  content: string;
  isNew: boolean;
};

const blank = (): Draft => ({
  slug: "",
  title: "",
  summary: "",
  tags: "",
  publishedAt: today(),
  draft: false,
  content: "",
  isNew: true,
});

const fromPost = (p: PostDetail): Draft => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary ?? "",
  tags: p.tags.join(", "),
  publishedAt: (p.publishedAt ?? today()).slice(0, 10),
  draft: p.draft,
  content: p.content.trim(),
  isNew: false,
});

export default function StudioEditor({
  studioKey,
  posts,
}: {
  studioKey: string;
  posts: PostDetail[];
}) {
  const [draft, setDraft] = useState<Draft>(
    posts[0] ? fromPost(posts[0]) : blank(),
  );
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);
  const [pending, start] = useTransition();

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => ({
      ...d,
      [k]: v,
      // New posts take their URL from the title until you edit it.
      ...(k === "title" && d.isNew && d.slug === slugify(d.title)
        ? { slug: slugify(String(v)) }
        : {}),
    }));

  const save = () =>
    start(async () => {
      setStatus(null);
      const res = await savePost(studioKey, {
        slug: draft.slug,
        title: draft.title,
        summary: draft.summary,
        tags: draft.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        publishedAt: draft.publishedAt,
        draft: draft.draft,
        content: draft.content,
      });
      setStatus(
        res.ok
          ? {
              tone: "ok",
              text: "Saved to GitHub. It goes live after the next deploy.",
            }
          : { tone: "error", text: `Couldn't save: ${res.error}` },
      );
      if (res.ok) setDraft((d) => ({ ...d, isNew: false }));
    });

  const remove = () => {
    if (
      !window.confirm(
        `Delete "${draft.title}"? This removes the post from the site.`,
      )
    )
      return;
    start(async () => {
      const res = await deletePost(studioKey, draft.slug);
      setStatus(
        res.ok
          ? {
              tone: "ok",
              text: "Deleted. It disappears after the next deploy.",
            }
          : { tone: "error", text: `Couldn't delete: ${res.error}` },
      );
      if (res.ok) setDraft(blank());
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <nav className="flex flex-col gap-1" aria-label="Posts">
        <Button
          variant="outline"
          className="mb-2 justify-start"
          onClick={() => setDraft(blank())}
        >
          <Plus /> New post
        </Button>
        {posts.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setDraft(fromPost(p))}
            className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
              draft.slug === p.slug && !draft.isNew
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {p.title}
            {p.draft && <span className="ml-2 text-xs">(draft)</span>}
          </button>
        ))}
      </nav>

      <form
        className="flex flex-col gap-4 rounded-xl border bg-background/80 p-5 backdrop-blur-sm"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="flex flex-col gap-1.5 text-sm">
          Title
          <Input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          URL
          <span className="flex items-center gap-1 text-muted-foreground">
            /blog/
            <Input
              value={draft.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              disabled={!draft.isNew}
              required
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Summary
          <Input
            value={draft.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto]">
          <label className="flex flex-col gap-1.5 text-sm">
            Tags (comma-separated)
            <Input
              value={draft.tags}
              onChange={(e) => set("tags", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Date
            <Input
              type="date"
              value={draft.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={draft.draft}
              onChange={(e) => set("draft", e.target.checked)}
            />
            Draft (hidden)
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Post (Markdown)</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreview((p) => !p)}
          >
            {preview ? <PenLine /> : <Eye />} {preview ? "Edit" : "Preview"}
          </Button>
        </div>
        {preview ? (
          <div className="prose min-h-[20rem] max-w-none rounded-md border p-4 dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>{draft.content}</Markdown>
          </div>
        ) : (
          <Textarea
            value={draft.content}
            onChange={(e) => set("content", e.target.value)}
            rows={16}
            className="min-h-[20rem] font-mono text-sm"
            required
          />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending}>
            {pending
              ? "Saving…"
              : draft.isNew
                ? "Publish post"
                : "Save changes"}
          </Button>
          {!draft.isNew && (
            <Button
              type="button"
              variant="outline"
              onClick={remove}
              disabled={pending}
            >
              <Trash2 /> Delete post
            </Button>
          )}
          {status && (
            <p
              role="status"
              className={`text-sm ${status.tone === "ok" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}
            >
              {status.text}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
