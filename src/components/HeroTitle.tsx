"use client";

import { useRef, type ComponentType } from "react";
import VariableProximityJs from "./VariableProximity";

// React Bits ships untyped JSX; TS would infer every prop as required.
const VariableProximity = VariableProximityJs as unknown as ComponentType<
  Record<string, unknown>
>;

// Letters thicken as the cursor nears. The emoji sits outside: the effect splits
// text per UTF-16 unit, which would break a surrogate pair.
export default function HeroTitle({
  text,
  emoji,
}: {
  text: string;
  emoji?: string;
}) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  return (
    <h1
      ref={containerRef}
      className="relative text-balance text-4xl leading-[1.05] tracking-tight sm:text-5xl"
    >
      <VariableProximity
        label={text}
        fromFontVariationSettings="'wght' 400, 'opsz' 9"
        toFontVariationSettings="'wght' 1000, 'opsz' 40"
        containerRef={containerRef}
        radius={100}
        falloff="linear"
        smoothing={0.2}
        scale={1}
        lift={0}
        idleWave={false}
      />
      {emoji && <span aria-hidden="true"> {emoji}</span>}
    </h1>
  );
}
