"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Same-size placeholder so the header doesn't shift when the icon appears.
  if (!mounted) {
    return <span className="block size-9" aria-hidden="true" />;
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon className="size-4 text-orange-300" />
      ) : (
        <MoonIcon className="size-4 text-indigo-500" />
      )}
      <span className="sr-only">Theme Toggle</span>
    </Button>
  );
}
