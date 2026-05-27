import React, { lazy, Suspense } from "react";
import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

const fallback = <div style={{ background: "#ddd", width: 24, height: 24 }} />;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: keyof typeof dynamicIconImports;
}

const ExternalSVG = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
    {...props}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const Icon = ({ name, ...props }: IconProps) => {
  const loader = (dynamicIconImports as any)[name];

  if (!loader || typeof loader !== "function") {
    return <ExternalSVG {...props} />;
  }

  const LucideIcon = lazy(loader as any);

  return (
    <Suspense fallback={fallback}>
      <LucideIcon {...props} />
    </Suspense>
  );
};

export default Icon;
