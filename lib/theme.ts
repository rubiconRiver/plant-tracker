// Theme Configuration - v6 Earthy Minimal
// This is our single source of truth for all theme values

export const theme = {
  name: 'Earthy Minimal',
  
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      foreground: 'hsl(var(--primary-foreground))',
      50: 'hsl(var(--primary-50))',
      100: 'hsl(var(--primary-100))',
      200: 'hsl(var(--primary-200))',
      300: 'hsl(var(--primary-300))',
      400: 'hsl(var(--primary-400))',
      500: 'hsl(var(--primary-500))',
      600: 'hsl(var(--primary-600))',
      700: 'hsl(var(--primary-700))',
      800: 'hsl(var(--primary-800))',
      900: 'hsl(var(--primary-900))',
    },
    
    // Secondary Colors (Brown/Earth)
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))',
      50: 'hsl(var(--secondary-50))',
      100: 'hsl(var(--secondary-100))',
      200: 'hsl(var(--secondary-200))',
      300: 'hsl(var(--secondary-300))',
      400: 'hsl(var(--secondary-400))',
      500: 'hsl(var(--secondary-500))',
      600: 'hsl(var(--secondary-600))',
      700: 'hsl(var(--secondary-700))',
      800: 'hsl(var(--secondary-800))',
      900: 'hsl(var(--secondary-900))',
    },
    
    // Accent Colors (Terracotta/Orange)
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))',
      50: 'hsl(var(--accent-50))',
      100: 'hsl(var(--accent-100))',
      200: 'hsl(var(--accent-200))',
      300: 'hsl(var(--accent-300))',
      400: 'hsl(var(--accent-400))',
      500: 'hsl(var(--accent-500))',
      600: 'hsl(var(--accent-600))',
      700: 'hsl(var(--accent-700))',
      800: 'hsl(var(--accent-800))',
      900: 'hsl(var(--accent-900))',
    },
    
    // Base Colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    
    // Card/Surface Colors
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))',
    },
    
    // Utility Colors
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    
    // Semantic Colors
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))',
    },
    
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))',
    },
    
    // Status Colors (for plants)
    status: {
      seedling: 'hsl(var(--status-seedling))',
      growing: 'hsl(var(--status-growing))',
      flowering: 'hsl(var(--status-flowering))',
      fruiting: 'hsl(var(--status-fruiting))',
      harvested: 'hsl(var(--status-harvested))',
      dormant: 'hsl(var(--status-dormant))',
    }
  },
  
  // Border Radius
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Spacing/Sizing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  
  // Typography
  font: {
    sans: 'var(--font-sans)',
    mono: 'var(--font-mono)',
  }
}

// Utility classes for common patterns
export const styles = {
  // Cards
  card: 'bg-card text-card-foreground rounded-2xl border border-border',
  cardHover: 'hover:shadow-lg transition-all duration-200',
  
  // Buttons
  buttonPrimary: 'bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all',
  buttonSecondary: 'bg-secondary text-secondary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-all',
  buttonOutline: 'border border-border bg-transparent px-4 py-2 rounded-xl font-medium hover:bg-muted transition-all',
  buttonGhost: 'px-4 py-2 rounded-xl font-medium hover:bg-muted transition-all',
  
  // Forms
  input: 'w-full px-3 py-2 bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring',
  label: 'text-sm font-medium text-foreground mb-1 block',
  
  // Text
  heading1: 'text-3xl font-light tracking-wide text-foreground',
  heading2: 'text-2xl font-light text-foreground',
  heading3: 'text-xl font-medium text-foreground',
  textMuted: 'text-muted-foreground',
  textSmall: 'text-sm text-muted-foreground',
  
  // Layout
  container: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-8 sm:py-12',
  
  // Status badges
  badge: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
  badgeSuccess: 'bg-primary/10 text-primary border border-primary/20',
  badgeWarning: 'bg-accent/10 text-accent border border-accent/20',
  badgeInfo: 'bg-secondary/10 text-secondary border border-secondary/20',
}

// Helper function to combine classes
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}