import { themeModes, themeConfig, type ThemeMode } from '../tokens/themes';

export const getStoredTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return themeModes.SYSTEM;
  try {
    const stored = window.localStorage.getItem(themeConfig.storageKey);
    if (stored === themeModes.LIGHT || stored === themeModes.DARK || stored === themeModes.SYSTEM) {
      return stored as ThemeMode;
    }
  } catch (e) {
    // Ignore errors from disabled localStorage
  }
  return themeModes.SYSTEM;
};

export const setStoredTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(themeConfig.storageKey, theme);
  } catch (e) {
    // Ignore errors
  }
};

export const applyTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  const isDark =
    theme === themeModes.DARK ||
    (theme === themeModes.SYSTEM &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
    root.setAttribute(themeConfig.attribute, 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute(themeConfig.attribute, 'light');
  }
};
