import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[100dvh] bg-slate-50 px-6 py-12 dark:bg-[#0B0F19]">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Welcome back, {session.user.name || session.user.email}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Your workspace is ready for saved documents and templates.
        </p>
      </div>
    </main>
  );
}
