'use client';

import * as React from 'react';

interface ThemeContextType {
  theme: 'dark';
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  forcedTheme?: string;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme] = React.useState<'dark'>('dark');

  React.useEffect(() => {
    const root = document.documentElement;
    
    // Apply dark theme only
    root.classList.remove('light');
    root.classList.add('dark');
    
    // Store theme preference
    localStorage.setItem('vite-ui-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
