import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const THEMES = [
  { id: 'dark', label: 'Midnight', icon: '🌙', description: 'Dark mode' },
  { id: 'light', label: 'Daylight', icon: '☀️', description: 'Light mode' },
  { id: 'mhdc', label: 'MHDC Classic', icon: '🏛️', description: 'Maroon & white' },
];

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = window.localStorage.getItem('theme');
  if (THEMES.some((t) => t.id === savedTheme)) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
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
