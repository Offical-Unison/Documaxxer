interface PlaceholderContentProps { title: string; description: string; }

export function PlaceholderContent({ title, description }: PlaceholderContentProps) {
  return (
    <div className="flex min-h-44 flex-col justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-5">
      <p className="text-base font-semibold text-slate-700">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}
