import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> { children: ReactNode; }

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-white/60 bg-white/60 p-5 shadow-[0_8px_32px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/60 dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] sm:p-7 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}