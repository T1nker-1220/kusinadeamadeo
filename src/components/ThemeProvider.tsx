'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const ThemeContext = createContext<{ theme: string; setTheme: (t: string) => void }>({ theme: 'default', setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('default');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 