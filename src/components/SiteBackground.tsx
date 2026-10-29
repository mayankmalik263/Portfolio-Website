"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ShapeGrid from "./ShapeGrid";

// Dark uses the requested palette; light swaps to colours that read on a white page.
const PALETTE = {
  dark: { lineColor: "#2a2734", hoverColor: "#ffffff" },
  light: { lineColor: "#e7e5ec", hoverColor: "#18181b" },
};

export default function SiteBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const colors =
    PALETTE[mounted && resolvedTheme === "light" ? "light" : "dark"];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <ShapeGrid
        shape="square"
        direction="diagonal"
        lineColor={colors.lineColor}
        hoverColor={colors.hoverColor}
        hoverFillColor={colors.hoverColor}
        fillOpacity={0.15}
        cellSize={40}
        speed={0.5}
        tiltX={0}
        tiltY={0}
        rainbow={false}
        // Optional in ShapeGrid; TS infers them as required from the untyped JSX.
        dpr={undefined}
        style={undefined}
      />
    </div>
  );
}
