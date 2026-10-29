"use client";

import { experienceCategories } from "@/lib/experience";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar";
import { EASE } from "./Reveal";

// Figures quoted from the role descriptions in career.json.
const STATS = [
  {
    value: 13,
    prefix: "",
    label: "member PR & sponsorship core built and led",
    source: "UPES IET",
  },
  {
    value: 150,
    prefix: "~",
    label: "registrations driven for Campus X Corporate",
    source: "UPES IET",
  },
  {
    value: 100,
    prefix: "~",
    label: "students supported into internship placements",
    source: "UPES SAMARTH",
  },
  {
    value: 40,
    prefix: "",
    label: "teams at a sold-out Horcrux Hunt, as PR lead",
    source: "UPES ACM",
  },
];

const orgs = experienceCategories
  .filter((c) => c.id === "leadership" || c.id === "pr")
  .flatMap((c) => c.experience)
  .reduce<(typeof experienceCategories)[number]["experience"]>((all, org) => {
    const existing = all.find((o) => o.name === org.name);
    if (existing) existing.positions.push(...org.positions);
    else all.push({ ...org, positions: [...org.positions] });
    return all;
  }, []);

function Count({ to, prefix }: { to: number; prefix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = `${prefix}${to}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => (el.textContent = `${prefix}${Math.round(v)}`),
    });
    return () => controls.stop();
  }, [inView, to, prefix]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {to}
    </span>
  );
}

export default function Communities() {
  const [active, setActive] = useState(0);
  const org = orgs[active];

  return (
    <div className="flex flex-col gap-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <dt className="order-2 text-sm text-muted-foreground">{s.label}</dt>
            <dd className="order-1 font-serif text-4xl tracking-tight">
              <Count to={s.value} prefix={s.prefix} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-3">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Communities"
        >
          {orgs.map((o, i) => (
            <button
              key={o.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors duration-200 active:scale-95 ${
                i === active
                  ? "border-transparent text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="community-active"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                />
              )}
              <Avatar className="relative size-5 border bg-white">
                <AvatarImage src={o.logo} alt="" className="object-contain" />
                <AvatarFallback className="text-[0.625rem]">
                  {o.name[0]}
                </AvatarFallback>
              </Avatar>
              <span className="relative">{o.name.replace(/ - .*/, "")}</span>
            </button>
          ))}
        </div>

        <div
          className="min-h-[9rem] rounded-xl border p-5"
          role="tabpanel"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={org.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-4"
            >
              {org.positions.map((p) => (
                <li
                  key={`${p.title}-${p.start}`}
                  className="flex flex-col gap-1"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="font-medium">{p.title}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {p.start} – {p.end ?? "Present"}
                    </span>
                  </div>
                  {p.description?.[0] && (
                    <p className="text-sm text-muted-foreground">
                      {p.description[0]}
                    </p>
                  )}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
        <Link href="/work" className="link w-fit text-sm">
          See every role on the Work page →
        </Link>
      </div>
    </div>
  );
}
