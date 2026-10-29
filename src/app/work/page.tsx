import Experience from "@/components/Experience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Work experience, leadership roles and education of Mayank Malik, B.Tech CSE (AI/ML) student at UPES.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="title">work.</h1>
        <p className="text-muted-foreground">
          Internships, leadership, PR and education, grouped by kind of role.
        </p>
      </div>

      <Experience />
    </article>
  );
}
