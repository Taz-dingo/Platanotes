import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card-light p-4 shadow-md backdrop-blur-md dark:bg-card-dark",
        hover &&
          "transform transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.02]",
        className
      )}
    >
      {children}
    </div>
  );
}
