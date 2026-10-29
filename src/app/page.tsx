import Communities from "@/components/Communities";
import HeroTitle from "@/components/HeroTitle";
import SkillsExplorer from "@/components/SkillsExplorer";
import LinkWithIcon from "@/components/LinkWithIcon";
import LocationMap from "@/components/LocationMap";
import Posts from "@/components/Posts";
import PostsSkeleton from "@/components/PostsSkeleton";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import Socials from "@/components/Socials";
import dynamic from "next/dynamic";
const SwipeCards = dynamic(() => import("@/components/SwipeCards"), {
  ssr: false,
  loading: () => (
    <div className="h-[233px] w-[175px] rounded-lg bg-muted md:mr-8" />
  ),
});
import { Button } from "@/components/ui/Button";
import { getPosts } from "@/lib/posts";
import { ArrowRightIcon, FileDown } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import homeContent from "@/data/home.json";

const LIMIT = 2;

async function RecentPosts() {
  const posts = (await getPosts())
    .filter((post) => !post.draft)
    .slice(0, LIMIT);
  return <Posts posts={posts} />;
}

function SectionHeading({
  title,
  href,
  linkText,
  children,
}: {
  title: string;
  href?: string;
  linkText?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="title text-2xl sm:text-3xl">{title}</h2>
        {href && (
          <LinkWithIcon
            href={href}
            position="right"
            icon={
              <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            }
            text={linkText}
            className="group shrink-0"
          />
        )}
      </div>
      {children && <p className="text-muted-foreground">{children}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <article className="mt-8 flex flex-col gap-20 pb-16">
      <section className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between">
        <SwipeCards className="md:mr-8" />

        <div className="flex max-w-[340px] flex-col sm:max-w-full">
          <HeroTitle
            text={homeContent.introduction.greeting.replace(
              /\s*[^\x00-\x7F]+\s*$/,
              "",
            )}
          />

          <p className="mt-3 text-sm font-medium sm:text-base">
            AI/ML engineer · Dehradun, India
          </p>

          <p className="mt-4 max-w-sm text-balance text-sm text-muted-foreground sm:text-base">
            {homeContent.introduction.description}
          </p>

          <span className="mt-4 flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-green-500" />
            </span>
            {homeContent.introduction.status}
          </span>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/resume.pdf" target="_blank">
                <span className="font-semibold">Resume</span>
                <FileDown className="size-5" />
              </Link>
            </Button>
            <Socials />
          </section>
        </div>
      </section>

      <Reveal className="flex flex-col gap-8">
        <SectionHeading
          title="featured projects"
          href="/projects"
          linkText="all projects"
        />
        <Projects limit={LIMIT} />
      </Reveal>

      <Reveal className="flex flex-col gap-8">
        <SectionHeading title="skills, with proof">
          Pick a skill to see the projects where I used it.
        </SectionHeading>
        <SkillsExplorer />
      </Reveal>

      <Reveal className="flex flex-col gap-8">
        <SectionHeading
          title="communities I lead"
          href="/work"
          linkText="all roles"
        >
          PR, sponsorship and student leadership at UPES, in numbers.
        </SectionHeading>
        <Communities />
      </Reveal>

      <Reveal className="flex flex-col gap-8">
        <SectionHeading title="where I can work">
          Remote, or on-site across Uttarakhand, Haryana and Delhi NCR.
        </SectionHeading>
        <LocationMap />
      </Reveal>

      <Reveal className="flex flex-col gap-8">
        <SectionHeading
          title="recent posts"
          href="/blog"
          linkText="all posts"
        />
        <Suspense fallback={<PostsSkeleton rows={LIMIT} />}>
          <RecentPosts />
        </Suspense>
      </Reveal>
    </article>
  );
}
