import { useTheme } from "../providers/ThemeProvider.jsx";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className="btn-outline" onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
