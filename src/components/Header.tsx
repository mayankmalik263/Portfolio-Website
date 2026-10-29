"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import CardNavJs from "./CardNav";

// React Bits ships untyped JSX; TS would infer every prop as required.
const CardNav = CardNavJs as unknown as ComponentType<Record<string, unknown>>;

const ITEMS = [
  {
    label: "Work",
    description: "Internships, startups, leadership, PR and education.",
    links: [
      { label: "All experience", href: "/work" },
      { label: "Resume (PDF)", href: "/resume.pdf" },
    ],
  },
  {
    label: "Projects",
    description: "AI systems, ML models and production websites.",
    links: [
      { label: "All projects", href: "/projects" },
      { label: "MASS", href: "/projects/mass" },
      { label: "APIx", href: "/projects/apix" },
    ],
  },
  {
    label: "Writing",
    description: "Notes on what I build and what I learn.",
    links: [{ label: "Blog", href: "/blog" }],
  },
  {
    label: "Contact",
    description: "Email is the fastest way to reach me.",
    links: [
      { label: "Contact form", href: "/contact" },
      { label: "Email", href: "mailto:mayankmalik263@gmail.com" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/mayankmalik263/",
      },
      { label: "GitHub", href: "https://github.com/mayankmalik263" },
    ],
  },
];

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <CardNav
        logo={
          <span className="font-serif text-lg tracking-tight">
            Mayank Malik
          </span>
        }
        logoAlt="Mayank Malik, home"
        logoHref="/"
        items={ITEMS}
        cta={{ label: "Resume", href: "/resume.pdf" }}
        theme={mounted && resolvedTheme === "light" ? "light" : "dark"}
        cardEffect="rise"
        openOn="click"
        linkComponent={Link}
        maxWidth={800}
      />
    </header>
  );
}
