import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Definisikan tipe untuk ThemeContext
interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

// Buat context dengan default value "light mode"
const ThemeContext = createContext<ThemeContextType>({
  darkMode: false, // Default "light mode"
  toggleTheme: () => {}, // Placeholder function
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
