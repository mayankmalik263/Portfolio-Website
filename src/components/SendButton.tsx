"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, type ComponentType } from "react";
import SlingButtonJs from "./SlingButton";

// React Bits ships untyped JSX; TS would infer every prop as required.
const SlingButton = SlingButtonJs as unknown as ComponentType<
  Record<string, unknown>
>;

const PALETTE = {
  dark: {
    padColor: "#f5f5f5",
    iconColor: "#18181b",
    accentColor: "#f5f5f5",
    wellColor: "#27272a",
    bandColor: "#52525b",
  },
  light: {
    padColor: "#18181b",
    iconColor: "#ffffff",
    accentColor: "#18181b",
    wellColor: "#e4e4e7",
    bandColor: "#a1a1aa",
  },
};

// Every "send" on the site uses this: tap, Enter, or pull back and release.
export default function SendButton({
  onSend,
  label = "Send",
  disabled = false,
}: {
  onSend: () => void;
  label?: string;
  disabled?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const colors =
    PALETTE[mounted && resolvedTheme === "light" ? "light" : "dark"];

  return (
    <span className="inline-flex items-center gap-4">
      <SlingButton
        onSend={onSend}
        {...colors}
        size={56}
        strokeWidth={3}
        armAt={48}
        maxPull={160}
        launchSpeed={2600}
        recoil={0.2}
        flight={120}
        particles={14}
        spread={60}
        axis="any"
        tapSends
        disabled={disabled}
        ariaLabel={label}
      />
      <span className="flex flex-col text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          Tap, or pull back and let go
        </span>
      </span>
    </span>
  );
}
