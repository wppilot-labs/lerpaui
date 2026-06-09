export const themeModes = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export type ThemeMode = typeof themeModes[keyof typeof themeModes];

export const themeConfig = {
  storageKey: 'lerpa-theme-mode',
  attribute: 'data-theme',
} as const;
