import { useEffect, useState } from "react";
import { RiMoonFill, RiSunLine } from "react-icons/ri";

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-slate-200 dark:bg-zinc-800 text-zinc-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-500 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <RiSunLine size={20} /> : <RiMoonFill size={20} />}
    </button>
  );
};
export default ThemeToggleButton;