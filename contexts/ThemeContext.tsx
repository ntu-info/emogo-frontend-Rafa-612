import React, { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    primary: string;
    danger: string;
  };
}

const lightColors = {
  background: '#ffffff',
  cardBackground: '#fafafa',
  text: '#1a1a1a',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#f0f0f0',
  primary: '#1a1a1a',
  danger: '#ff3b30',
};

const darkColors = {
  background: '#000000',
  cardBackground: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#999999',
  textTertiary: '#666666',
  border: '#333333',
  primary: '#ffffff',
  danger: '#ff453a',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
