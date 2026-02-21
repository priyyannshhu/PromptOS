import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/20 bg-card/40 backdrop-blur-sm',
        'shadow-sm shadow-black/5',
        'transition-all duration-300',
        hover && 'hover:border-border/40 hover:bg-card/60 hover:shadow-md hover:shadow-black/10',
        className
      )}
    >
      {children}
    </div>
  );
}
