import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Icon from "./Icon";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, slug, description, tags, links, media } = project;
  const image =
    media.find((m) => m.type === "image")?.src || project.image || undefined;
  const title = name.split(" — ")[0];

  return (
    <Card className="group relative flex flex-col transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* Stretched link: the whole card opens the project page. */}
      <Link
        href={`/projects/${slug}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Read about ${title}`}
      />
      <CardHeader>
        {image ? (
          <ImageWithSkeleton
            src={image}
            alt=""
            width={500}
            height={300}
            sizes="(max-width: 640px) calc(100vw - 4rem), 344px"
            quality={75}
            containerClassName="h-40 w-full rounded-md"
            className="h-40 w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-40 w-full items-end rounded-md bg-muted p-4">
            <span className="font-serif text-4xl text-muted-foreground">
              {title
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardTitle className="flex items-start justify-between gap-2">
          {title}
          <ArrowUpRight
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            aria-hidden="true"
          />
        </CardTitle>
        <p className="text-pretty text-sm text-muted-foreground">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {[...tags].sort().map((tag) => (
              <Badge
                key={tag}
                className="px-1.5 py-0 text-xs"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links.length > 0 && (
          <div className="relative z-10 flex flex-row flex-wrap items-start gap-1">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge className="flex gap-2 px-2 py-1 text-xs transition-transform active:scale-95">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
