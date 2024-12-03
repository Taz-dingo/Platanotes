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
        "rounded-lg bg-[rgba(255,255,255,0.5)] p-4 shadow-md backdrop-blur-md",
        hover &&
          "transform transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:scale-[1.02]",
        className
      )}
    >
      {children}
    </div>
  );
}
