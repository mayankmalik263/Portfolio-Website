import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mayankmalik.vercel.app";

  // Static routes
  const staticRoutes = ["", "/blog", "/projects", "/contact", "/privacy"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })
  );

  // Dynamic Blog routes
  const blogDirectory = path.join(process.cwd(), "content/blog");
  let blogRoutes: MetadataRoute.Sitemap = [];

  if (fs.existsSync(blogDirectory)) {
    const postSlugs = fs.readdirSync(blogDirectory);
    blogRoutes = postSlugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug.replace(/\.mdx$/, "")}`,
      lastModified: new Date(),
    }));
  }

  return [...staticRoutes, ...blogRoutes];
}
