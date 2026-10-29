"use client";

import { EASE } from "@/components/Reveal";
import { motion } from "framer-motion";

// Re-mounts on every route change, so each page eases in.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
