"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type MermaidProps = {
  chart: string;
  className?: string;
};

export default function Mermaid({ chart, className }: MermaidProps) {
  const { resolvedTheme } = useTheme();
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chart?.trim()) return;

    let cancelled = false;

    // Dynamically import mermaid to avoid shipping it in the initial bundle
    // on pages that don't render diagrams (reduces unused JS).
    (async () => {
      try {
        const mod = await import("mermaid");
        const m = (mod && (mod.default ?? mod)) as any;

        m.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: resolvedTheme === "dark" ? "dark" : "default",
        });

        const result = await m.render(id, chart);
        if (!cancelled) {
          setSvg(result.svg);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Mermaid diagram failed to render");
          console.error(err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  if (error) {
    return (
      <div
        className={cn(
          "my-6 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
          className,
        )}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "my-8 overflow-x-auto rounded-lg bg-muted/30 p-4",
        "dark:border dark:border-border/70 dark:bg-muted/30",
        className,
      )}
    >
      {/* Mermaid injects an <svg> string */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
