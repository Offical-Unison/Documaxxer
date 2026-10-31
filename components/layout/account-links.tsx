"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

/** Session-aware account actions shared by the landing navbar and the builder header. */
export function AccountLinks({ compact = false }: { compact?: boolean }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />;
  }

  const secondary = compact
    ? "text-xs font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
    : "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800";
  const primary = compact
    ? "text-xs font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400"
    : "rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700";

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className={primary}>Dashboard</Link>
        <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className={secondary}>Log out</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={secondary}>Log in</Link>
      {!compact && <Link href="/signup" className={primary}>Sign up</Link>}
    </div>
  );
}
