"use client";

import { useTheme } from "@/context/theme-context";

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
      <circle cx="10" cy="10" r="3.2" />
      <path d="M10 2.2v1.6M10 16.2v1.6M2.2 10h1.6M16.2 10h1.6M4.6 4.6l1.2 1.2M14.2 14.2l1.2 1.2M15.4 4.6l-1.2 1.2M5.8 14.2l-1.2 1.2" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M16.5 12.3A6.8 6.8 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center rounded-full border border-blue-100 bg-blue-50/60 transition-colors dark:border-blue-900/60 dark:bg-blue-950/40"
    >
      <span
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:rotate-12 dark:bg-blue-500 ${
          isDark ? "translate-x-[28px]" : "translate-x-0"
        }`}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}