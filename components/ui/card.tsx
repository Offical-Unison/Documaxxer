import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> { children: ReactNode; }

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-[#121824]/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] sm:p-7 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}