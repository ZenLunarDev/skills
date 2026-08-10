import { createContext, useContext, ReactNode } from 'react';
import { theme } from './theme';

const ThemeContext = createContext(theme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div className="theme-root" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
