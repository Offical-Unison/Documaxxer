interface PlaceholderContentProps { title: string; description: string; }

export function PlaceholderContent({ title, description }: PlaceholderContentProps) {
  return (
    <div className="flex min-h-44 flex-col justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-800/50">
      <p className="text-base font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400 dark:text-slate-500">{description}</p>
    </div>
  );
}