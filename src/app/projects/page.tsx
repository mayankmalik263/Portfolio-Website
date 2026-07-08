import Projects from "@/components/Projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects by Mayank Malik - AI/ML systems, LLM-powered applications, and full-stack web builds spanning machine learning, automation, and modern web development.",
  keywords: [
    "Mayank Malik projects",
    "AI projects",
    "machine learning projects",
    "LLM projects",
    "full stack projects portfolio",
  ],
  alternates: { canonical: "/projects" },
};

export default async function ProjectPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <h1 className="title">my projects.</h1>

      <Projects />
    </article>
  );
}
