import fs from "fs";
import path from "path";

export async function GET() {
  const baseUrl = "https://mayankmalik.vercel.app";

  // Static routes
  const staticRoutes = ["/", "/blog", "/projects", "/contact", "/privacy"].map(
    (route) => `${baseUrl}${route}`
  );

  // Dynamic Blog routes
  const blogDirectory = path.join(process.cwd(), "content/blog");
  let blogRoutes: string[] = [];

  if (fs.existsSync(blogDirectory)) {
    const postSlugs = fs.readdirSync(blogDirectory);
    blogRoutes = postSlugs.map(
      (slug) => `${baseUrl}/blog/${slug.replace(/\.(md|mdx)$/, "")}`
    );
  }

  const allRoutes = [...staticRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((url) => {
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
