import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> { children: ReactNode; }
export function Card({ children, className = "", ...props }: CardProps) {
  return <section className={`rounded-3xl border border-white/75 bg-white/70 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7 ${className}`} {...props}>{children}</section>;
}
