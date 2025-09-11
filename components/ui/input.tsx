import React from 'react'
import { cn } from '@/lib/theme'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ 
  label,
  error,
  hint,
  className,
  id,
  ...props 
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="text-sm font-medium text-foreground mb-1 block"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2 bg-background border rounded-xl',
          'focus:outline-none focus:ring-2 focus:ring-ring transition-all',
          error ? 'border-destructive' : 'border-input',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export function Textarea({ 
  label,
  error,
  hint,
  className,
  id,
  ...props 
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-sm font-medium text-foreground mb-1 block"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-3 py-2 bg-background border rounded-xl min-h-[80px]',
          'focus:outline-none focus:ring-2 focus:ring-ring transition-all',
          error ? 'border-destructive' : 'border-input',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
}

export function Select({ 
  label,
  error,
  hint,
  options,
  className,
  id,
  ...props 
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="text-sm font-medium text-foreground mb-1 block"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-3 py-2 bg-background border rounded-xl',
          'focus:outline-none focus:ring-2 focus:ring-ring transition-all',
          error ? 'border-destructive' : 'border-input',
          className
        )}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  )
}