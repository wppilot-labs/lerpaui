import { useEffect, useState, useCallback } from 'react';
import { themeModes, type ThemeMode } from '../tokens/themes';
import { getStoredTheme, setStoredTheme, applyTheme } from '../lib/theme';

export function useThemeMode() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  }, []);

  useEffect(() => {
    // Initial apply
    applyTheme(theme);

    // If set to system, listen to system preferences changing
    if (theme === themeModes.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => {
        applyTheme(themeModes.SYSTEM);
      };
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === themeModes.LIGHT ? themeModes.DARK : themeModes.LIGHT);
  }, [theme, setTheme]);

  return {
    theme,
    isDark: typeof window !== 'undefined' ? window.document.documentElement.classList.contains('dark') : false,
    setTheme,
    toggleTheme,
  };
}
