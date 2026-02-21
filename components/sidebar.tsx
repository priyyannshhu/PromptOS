import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  children: ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border/40',
        'bg-card/50 backdrop-blur-md',
        className
      )}
    >
      {children}
    </aside>
  );
}

interface SidebarContentProps {
  children: ReactNode;
  className?: string;
}

export function SidebarContent({ children, className }: SidebarContentProps) {
  return (
    <div className={cn('space-y-2 p-4', className)}>
      {children}
    </div>
  );
}

interface SidebarItemProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export function SidebarItem({
  children,
  onClick,
  active = false,
  className,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-primary/20 text-primary'
          : 'text-muted-foreground hover:bg-card/50 hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
}
