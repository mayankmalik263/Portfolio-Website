import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  draft: boolean;
  coAuthors?: string[];
  views?: number;
};

export type PostDetail = PostSummary & {
  content: string;
};

const contentDir = path.join(process.cwd(), "content/blog");

export async function getPosts(limit?: number): Promise<PostSummary[]> {
  try {
    if (!fs.existsSync(contentDir)) {
      return [];
    }

    const fileNames = fs.readdirSync(contentDir);
    const posts: PostSummary[] = fileNames
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map((fileName) => {
        const fullPath = path.join(contentDir, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(fileContents);

        const slug = fileName.replace(/\.mdx?$/, "");
        
        const post: PostSummary = {
          id: slug,
          slug,
          title: matterResult.data.title || slug,
          summary: matterResult.data.summary,
          image: matterResult.data.image,
          publishedAt: matterResult.data.publishedAt instanceof Date ? matterResult.data.publishedAt.toISOString() : matterResult.data.publishedAt,
          updatedAt: matterResult.data.updatedAt instanceof Date ? matterResult.data.updatedAt.toISOString() : matterResult.data.updatedAt,
          tags: matterResult.data.tags || [],
          readingTime: matterResult.data.readingTime || "1 min read",
          draft: matterResult.data.draft || false,
          coAuthors: matterResult.data.coAuthors,
          views: 0,
        };
        return JSON.parse(JSON.stringify(post));
      });

    // Sort posts by date descending
    const sortedPosts = posts.sort((a, b) => {
      if (!a.publishedAt || !b.publishedAt) return 0;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return limit ? sortedPosts.slice(0, limit) : sortedPosts;
  } catch (err) {
    console.error("Error fetching posts:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const fullPathMd = path.join(contentDir, `${slug}.md`);
    const fullPathMdx = path.join(contentDir, `${slug}.mdx`);
    
    let fullPath = "";
    if (fs.existsSync(fullPathMd)) {
      fullPath = fullPathMd;
    } else if (fs.existsSync(fullPathMdx)) {
      fullPath = fullPathMdx;
    } else {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const post: PostDetail = {
      id: slug,
      slug,
      title: matterResult.data.title || slug,
      summary: matterResult.data.summary,
      image: matterResult.data.image,
      publishedAt: matterResult.data.publishedAt instanceof Date ? matterResult.data.publishedAt.toISOString() : matterResult.data.publishedAt,
      updatedAt: matterResult.data.updatedAt instanceof Date ? matterResult.data.updatedAt.toISOString() : matterResult.data.updatedAt,
      tags: matterResult.data.tags || [],
      readingTime: matterResult.data.readingTime || "1 min read",
      draft: matterResult.data.draft || false,
      coAuthors: matterResult.data.coAuthors,
      views: 0,
      content: matterResult.content,
    };
    return JSON.parse(JSON.stringify(post));
  } catch (err) {
    console.error(`Error fetching post ${slug}:`, err);
    return null;
  }
}
