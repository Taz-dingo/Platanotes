import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg bg-[rgba(255,255,255,0.5)] shadow-md backdrop-blur-md',
        hover && 'transition-transform duration-300 will-change-transform transform hover:scale-[1.02] hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}
