
import React, { createContext, useContext } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Provider only uses light theme and has no toggle functionality
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always light theme
  const theme: Theme = "light";
  const toggleTheme = () => {
    // No-op function - theme toggle completely disabled
    console.log("Theme toggle disabled");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
