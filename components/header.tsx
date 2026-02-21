import React from 'react';
import Link from 'next/link';
import { Zap, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="rounded-lg bg-primary/15 p-2">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold text-foreground">PromptOS</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/editor"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Editor
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </nav>

        {/* Logo Icon */}
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-primary" />
        </div>
      </div>
    </header>
  );
}
