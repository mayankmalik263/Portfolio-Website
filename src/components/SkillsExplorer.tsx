"use client";

import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import BranchedMenuJs from "./BranchedMenu";

// React Bits ships untyped JSX; TS would infer every prop as required.
const BranchedMenu = BranchedMenuJs as unknown as ComponentType<
  Record<string, unknown>
>;
import { EASE } from "./Reveal";

const projects = projectSchema.parse(data).projects;

// Only skills that at least one project actually uses (its tags), so every pick has proof.
const GROUPS = [
  {
    label: "AI & machine learning",
    skills: [
      "Python",
      "LangGraph",
      "AI Agents",
      "XGBoost",
      "Machine Learning",
      "SimPy",
    ],
  },
  {
    label: "Web & product",
    skills: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Framer Motion",
    ],
  },
  {
    label: "Data & systems",
    skills: [
      "FastAPI",
      "Playwright",
      "Data Engineering",
      "Statistics",
      "Networking",
      "Java",
      "OpenGL",
    ],
  },
];

const usedIn = (skill: string) =>
  projects.filter((p) => p.tags.includes(skill));

const items = GROUPS.map((g) => ({
  label: g.label,
  children: g.skills
    .filter((s) => usedIn(s).length > 0)
    .map((s) => ({ value: s, label: s })),
}));

const PALETTE = {
  dark: { color: "#f5f5f5", accentColor: "#f5f5f5", lineColor: "#3f3f46" },
  light: { color: "#18181b", accentColor: "#18181b", lineColor: "#d4d4d8" },
};

export default function SkillsExplorer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [skill, setSkill] = useState(items[0].children[0].value);
  const colors =
    PALETTE[mounted && resolvedTheme === "light" ? "light" : "dark"];
  const matches = usedIn(skill);

  return (
    <div className="grid gap-6 sm:grid-cols-[240px_1fr]">
      <BranchedMenu
        items={items}
        defaultOpen={[0]}
        defaultActive={skill}
        onSelect={(value: string) => setSkill(value)}
        {...colors}
        width={240}
        rowHeight={36}
        indent={40}
        trunk={14}
        radius={10}
        lineWidth={1.5}
        fontSize={14}
        drawDuration={400}
        foldDuration={300}
      />

      <div
        className="min-h-[14rem] rounded-xl border bg-background/70 p-5 backdrop-blur-sm"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-serif text-2xl tracking-tight">
                {skill}
              </span>
              <span className="text-xs text-muted-foreground">
                used in {matches.length}{" "}
                {matches.length === 1 ? "project" : "projects"}
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {matches.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors duration-200 hover:bg-muted/60"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {p.name.split(" — ")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {p.context}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
