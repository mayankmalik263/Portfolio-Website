"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { experienceCategories } from "@/lib/experience";
import { motion } from "framer-motion";
import { useState } from "react";
import Timeline from "./Timeline";

export default function Experience() {
  const [tab, setTab] = useState(experienceCategories[0].id);

  return (
    <Tabs value={tab} onValueChange={setTab}>
      {/* Tabs size to their labels and scroll sideways on narrow screens. */}
      <TabsList className="mb-2 flex h-auto w-full justify-start overflow-x-auto [scrollbar-width:none]">
        {experienceCategories.map((c) => (
          <TabsTrigger
            key={c.id}
            value={c.id}
            className="relative flex-auto shrink-0 px-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {tab === c.id && (
              <motion.span
                layoutId="experience-tab"
                className="absolute inset-0 rounded-md bg-background shadow"
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              />
            )}
            <span className="relative">{c.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {experienceCategories.map((c) => (
        <TabsContent key={c.id} value={c.id}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Timeline experience={c.experience} />
          </motion.div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
