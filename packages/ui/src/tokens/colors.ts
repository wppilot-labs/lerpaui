export const colors = {
  background: 'var(--background, #ffffff)',
  foreground: 'var(--foreground, #0f172a)',
  card: {
    DEFAULT: 'var(--card, #ffffff)',
    foreground: 'var(--card-foreground, #0f172a)',
  },
  popover: {
    DEFAULT: 'var(--popover, #ffffff)',
    foreground: 'var(--popover-foreground, #0f172a)',
  },
  primary: {
    DEFAULT: 'var(--primary, #2563eb)',
    foreground: 'var(--primary-foreground, #ffffff)',
  },
  secondary: {
    DEFAULT: 'var(--secondary, #f1f5f9)',
    foreground: 'var(--secondary-foreground, #0f172a)',
  },
  muted: {
    DEFAULT: 'var(--muted, #f1f5f9)',
    foreground: 'var(--muted-foreground, #64748b)',
  },
  accent: {
    DEFAULT: 'var(--accent, #f1f5f9)',
    foreground: 'var(--accent-foreground, #0f172a)',
  },
  destructive: {
    DEFAULT: 'var(--destructive, #ef4444)',
    foreground: 'var(--destructive-foreground, #ffffff)',
  },
  border: 'var(--border, #e2e8f0)',
  input: 'var(--input, #e2e8f0)',
  ring: 'var(--ring, #2563eb)',
  
  // Palette references
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  }
} as const;
