import Icon from "@/components/Icon";
import LinkWithIcon from "@/components/LinkWithIcon";
import Reveal from "@/components/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const projects = projectSchema.parse(data).projects;
const find = (slug: string) => projects.find((p) => p.slug === slug);

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = find(params.slug);
  if (!project) return {};
  return {
    title: project.name.split(" — ")[0],
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = find(params.slug);
  if (!project) notFound();

  const title = project.name.split(" — ")[0];
  const subtitle = project.name.split(" — ")[1];

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <LinkWithIcon
        href="/projects"
        position="left"
        icon={<ArrowLeftIcon className="size-5" />}
        text="all projects"
      />

      <header className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          {project.context}
        </span>
        <h1 className="title text-balance text-4xl sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </header>

      {project.media.length > 0 && (
        <Reveal className="flex flex-col gap-4">
          {project.media.map((m) =>
            m.type === "video" ? (
              <video
                key={m.src}
                src={m.src}
                poster={m.poster}
                controls
                playsInline
                className="w-full rounded-xl border"
              />
            ) : (
              <Image
                key={m.src}
                src={m.src}
                alt={m.alt ?? title}
                width={1200}
                height={676}
                sizes="(max-width: 768px) 100vw, 704px"
                className="w-full rounded-xl border"
                priority
              />
            ),
          )}
        </Reveal>
      )}

      <Reveal className="flex flex-col gap-6">
        <p className="text-pretty text-base leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {project.links.map((link, i) => (
            <Button
              key={link.href}
              asChild
              variant={i === 0 ? "default" : "outline"}
            >
              <Link href={link.href} target="_blank" rel="noopener noreferrer">
                <Icon name={link.icon} className="size-4" />
                {link.name === "Website" ? "Open live site" : "View source"}
              </Link>
            </Button>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
