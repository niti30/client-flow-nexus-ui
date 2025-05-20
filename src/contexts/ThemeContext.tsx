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

// We're keeping this provider but making it always return light theme
// This ensures that components depending on this context will still work
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Always light theme, toggle does nothing
  const theme: Theme = "light";
  const toggleTheme = () => {
    // No-op function - theme toggle disabled
    console.log("Theme toggle disabled");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
