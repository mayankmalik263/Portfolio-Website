import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const standardNumberFormatter = new Intl.NumberFormat("en-US");

export function formatViews(views: number) {
  const safeViews = Math.max(0, Math.round(views));
  return safeViews < 1000
    ? standardNumberFormatter.format(safeViews)
    : compactNumberFormatter.format(safeViews);
}

export function calculateDuration(
  startDate: string,
  endDate: string | undefined | null,
) {
  const start = new Date(startDate);
  const end =
    endDate && endDate.toLowerCase() !== "present"
      ? new Date(endDate)
      : new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "";
  }

  const years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth() + 1;

  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;

  const displayYears = Math.floor(totalMonths / 12);
  const displayMonths = totalMonths % 12;

  let durationStr = "";
  if (displayYears > 0) {
    durationStr += `${displayYears} yr${displayYears > 1 ? "s" : ""}`;
  }
  if (displayMonths > 0) {
    if (durationStr) durationStr += " ";
    durationStr += `${displayMonths} mo${displayMonths > 1 ? "s" : ""}`;
  }

  return durationStr ? ` · ${durationStr}` : "";
}
