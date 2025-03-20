import { useDarkMode } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useDarkMode();

  return (
    <button onClick={toggleTheme} className="text-xl">
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
