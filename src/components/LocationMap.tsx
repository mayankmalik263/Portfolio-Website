"use client";

import map from "@/data/north-india-map.json";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, MapPin } from "lucide-react";
import { useState } from "react";
import { EASE } from "./Reveal";

type Place = {
  id: string;
  name: string;
  region: string;
  coords?: [number, number]; // lon, lat
  status: string;
  detail: string;
};

// Remote first, always.
const PLACES: Place[] = [
  {
    id: "remote",
    name: "Remote",
    region: "Anywhere",
    status: "Available for remote work",
    detail:
      "Open to fully remote roles, collaborating online from wherever I am.",
  },
  {
    id: "Dehradun",
    name: "Dehradun",
    region: "Uttarakhand",
    coords: [78.0322, 30.3165],
    status: "Based here",
    detail: "Where I study at UPES. Available on-site now.",
  },
  {
    id: "Rohtak",
    name: "Rohtak",
    region: "Haryana",
    coords: [76.6066, 28.8955],
    status: "Available on-site",
    detail: "Where I went to school. Open to on-site and hybrid roles.",
  },
  {
    id: "Delhi",
    name: "Delhi",
    region: "NCT of Delhi",
    coords: [77.209, 28.6139],
    status: "Available on-site",
    detail: "Open to on-site and hybrid roles in Delhi NCR.",
  },
  {
    id: "Gurgaon",
    name: "Gurgaon",
    region: "Haryana",
    coords: [77.0266, 28.4595],
    status: "Available on-site",
    detail: "Open to on-site and hybrid roles in Delhi NCR.",
  },
];

// Label side per city, so the NCR cluster doesn't overlap.
const LABEL_SIDE: Record<string, "left" | "right"> = {
  Dehradun: "right",
  Rohtak: "left",
  Delhi: "right",
  Gurgaon: "left",
};

const HOME: [number, number] = [78.0322, 30.3165];
const HIGHLIGHT = new Set(["Haryana", "Delhi", "Uttarakhand"]);

function km([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const r = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * r) / 2) ** 2 +
    Math.cos(lat1 * r) *
      Math.cos(lat2 * r) *
      Math.sin(((lon2 - lon1) * r) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)));
}

const { width: W, height: H } = map.region;
const cities: Record<string, number[]> = map.region.cities;

export default function LocationMap() {
  const [selected, setSelected] = useState(PLACES[1]);
  const remote = selected.id === "remote";

  return (
    <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
      {/* Map */}
      <div
        className={`relative overflow-hidden rounded-xl border bg-muted/30 transition-[box-shadow] duration-500 ${
          remote ? "shadow-[inset_0_0_0_2px_hsl(var(--foreground)/0.15)]" : ""
        }`}
      >
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${remote ? "opacity-50" : ""}`}
            role="img"
            aria-label="Map of North India showing Dehradun, Rohtak, Delhi and Gurgaon"
          >
            {map.region.states.map((s) => (
              <path
                key={s.name}
                d={s.d}
                className={
                  HIGHLIGHT.has(s.name)
                    ? "fill-foreground/[0.09] stroke-foreground/25"
                    : "fill-foreground/[0.03] stroke-foreground/15"
                }
                strokeWidth={1}
                strokeLinejoin="round"
              />
            ))}
            {map.region.labels.map((l) => (
              <text
                key={l.name}
                x={l.at[0]}
                y={l.at[1]}
                textAnchor="middle"
                className="fill-muted-foreground text-[13px] uppercase tracking-[0.12em]"
              >
                {l.name}
              </text>
            ))}
          </svg>

          {/* City markers are real buttons, positioned over the map. */}
          {PLACES.filter((p) => p.coords).map((p) => {
            const [x, y] = cities[p.id];
            const active = p.id === selected.id;
            const side = LABEL_SIDE[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                aria-pressed={active}
                aria-label={`${p.name}, ${p.region}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              >
                {active && !remote && (
                  <motion.span
                    className="absolute inset-0 m-auto size-3 rounded-full bg-foreground/30"
                    animate={{ scale: [1, 3], opacity: [0.6, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}
                <span
                  className={`relative block rounded-full border-2 border-background transition-[transform,background-color] duration-200 group-hover:scale-125 group-active:scale-95 ${
                    active && !remote
                      ? "size-3.5 bg-foreground"
                      : "size-3 bg-muted-foreground"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-background/90 px-2 py-0.5 text-xs shadow-sm transition-colors ${
                    side === "right" ? "left-full ml-0.5" : "right-full mr-0.5"
                  } ${active && !remote ? "font-medium text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
                >
                  {p.name}
                </span>
              </button>
            );
          })}

          {/* India inset: where this region sits. */}
          <svg
            viewBox={`0 0 ${map.inset.width} ${map.inset.height}`}
            className="absolute right-3 top-3 w-16 sm:w-20"
            aria-hidden="true"
          >
            <path
              d={map.inset.d}
              className="fill-foreground/10 stroke-foreground/30"
              strokeWidth={0.6}
            />
            <rect
              x={map.inset.box[0]}
              y={map.inset.box[1]}
              width={map.inset.box[2]}
              height={map.inset.box[3]}
              className="fill-foreground/20 stroke-foreground"
              strokeWidth={0.8}
            />
          </svg>

          <AnimatePresence>
            {remote && (
              <motion.div
                className="absolute inset-0 grid place-items-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <span className="flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
                  <Globe className="size-4" /> Remote, from anywhere
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* List + details */}
      <div className="flex flex-col gap-3">
        <ul className="flex flex-col gap-1" aria-label="Work locations">
          {PLACES.map((p) => {
            const active = p.id === selected.id;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  aria-pressed={active}
                  className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 active:scale-[0.99] ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="location-active"
                      className="absolute inset-0 rounded-lg bg-muted"
                      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                    />
                  )}
                  <span className="relative">
                    {p.coords ? (
                      <MapPin className="size-4" />
                    ) : (
                      <Globe className="size-4" />
                    )}
                  </span>
                  <span className="relative font-medium">{p.name}</span>
                  <span className="relative text-xs text-muted-foreground">
                    {p.region}
                  </span>
                  {active && (
                    <Check
                      className="relative ml-auto size-4"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className="relative min-h-[7.5rem] overflow-hidden rounded-xl border p-4"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-col gap-1"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {selected.status}
              </span>
              <span className="font-serif text-2xl tracking-tight">
                {selected.name}
              </span>
              <p className="text-sm text-muted-foreground">{selected.detail}</p>
              {selected.coords && selected.id !== "Dehradun" && (
                <p className="text-xs text-muted-foreground">
                  About {km(HOME, selected.coords)} km from Dehradun
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
