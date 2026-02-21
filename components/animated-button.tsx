'use client';

import React, { useRef, useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  animated?: boolean;
}

export function AnimatedButton({
  children,
  animated = true,
  className,
  ...props
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!animated || !buttonRef.current) return;

    const button = buttonRef.current;

    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.03,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const handleMouseDown = () => {
      gsap.to(button, {
        scale: 0.96,
        duration: 0.1,
        ease: 'power2.inOut',
      });
    };

    const handleMouseUp = () => {
      gsap.to(button, {
        scale: 1.03,
        duration: 0.1,
        ease: 'power2.out',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, [animated]);

  return (
    <Button
      ref={buttonRef}
      className={cn(
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
