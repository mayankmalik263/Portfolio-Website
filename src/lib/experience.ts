import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import {
  careerSchema,
  educationSchema,
  type Experience,
  type ExperiencePosition,
} from "./schemas";

export type ExperienceCategory = {
  id: string;
  name: string;
  experience: Experience[];
};

// A position's `category` in career.json wins; otherwise it is inferred from the title.
export function categoryOf(p: ExperiencePosition) {
  if (p.category) return p.category;
  if (/intern/i.test(p.title)) return "tech";
  if (/\bPR\b|Sponsorship|Marketing|Public Relations/.test(p.title))
    return "pr";
  if (/^(prime )?member$/i.test(p.title)) return "communities";
  return "leadership";
}

const career = careerSchema.parse(careerData).career;

const byCategory = (id: string) =>
  career.flatMap((org) => {
    const positions = org.positions.filter((p) => categoryOf(p) === id);
    return positions.length ? [{ ...org, positions }] : [];
  });

export const experienceCategories: ExperienceCategory[] = [
  {
    id: "tech",
    name: "Internships & startups",
    experience: byCategory("tech"),
  },
  {
    id: "leadership",
    name: "Leadership",
    experience: byCategory("leadership"),
  },
  { id: "pr", name: "PR & sponsorship", experience: byCategory("pr") },
  {
    id: "communities",
    name: "Communities",
    experience: byCategory("communities"),
  },
  {
    id: "education",
    name: "Education",
    experience: educationSchema.parse(educationData).education,
  },
];
