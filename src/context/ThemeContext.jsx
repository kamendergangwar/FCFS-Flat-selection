import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem } from '../utils/indexedDB';

const ThemeContext = createContext(null);

const THEMES = [
  { id: 'dark', label: 'Midnight', icon: '🌙', description: 'Dark mode' },
  { id: 'light', label: 'Daylight', icon: '☀️', description: 'Light mode' },
  { id: 'mhdc', label: 'MHDC Classic', icon: '🏛️', description: 'Maroon & white' },
];

const DEFAULT_THEME = 'mhdc';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  // Hydrate from IndexedDB once on mount
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await getItem('theme');
        if (savedTheme && THEMES.some((t) => t.id === savedTheme)) {
          setTheme(savedTheme);
        }
      } catch (err) {
        console.warn('[ThemeContext] Failed to read theme from IndexedDB', err);
      }
    })();
  }, []);

  // Apply theme to DOM and persist whenever it changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  const setThemeById = (id) => {
    if (THEMES.some((t) => t.id === id)) {
      setTheme(id);
    }
  };

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    isMhdc: theme === 'mhdc',
    themes: THEMES,
    toggleTheme,
    setThemeById,
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
