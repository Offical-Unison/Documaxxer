import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; asChild?: false };
type LinkButtonProps = { children: ReactNode; asChild: true; className?: string };

export function Button({ children, className = "", asChild, ...props }: ButtonProps | LinkButtonProps) {
  const styles = `inline-flex min-h-11 items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-400 ${className}`;
  if (asChild) return <span className={styles}>{children}</span>;
  return <button className={styles} {...props}>{children}</button>;
}