import React from 'react'
import { cn } from '@/lib/theme'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export function Badge({ 
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props 
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium transition-all'
  
  const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-primary/10 text-primary border border-primary/20',
    warning: 'bg-accent/10 text-accent border border-accent/20',
    error: 'bg-destructive/10 text-destructive border border-destructive/20',
    info: 'bg-secondary/10 text-secondary border border-secondary/20'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }
  
  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}