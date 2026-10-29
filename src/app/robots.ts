import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/studio/",
      },
    ],
    sitemap: "https://mayankmalik.vercel.app/sitemap.xml",
  };
}
