import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('taskqueue_theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm"
      style={{
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
        borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
        color: theme === 'dark' ? '#38bdf8' : '#0284c7'
      }}
      title="Toggle Light/Dark Mode"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
}