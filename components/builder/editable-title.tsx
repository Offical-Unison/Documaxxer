"use client";

import { useState } from "react";

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M13.5 3.5 16.5 6.5 6.5 16.5H3.5V13.5Z" />
    </svg>
  );
}

interface EditableTitleProps {
  title: string;
  onSave: (title: string) => void;
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export function EditableTitle({ title, onSave, as = "h2", className = "" }: EditableTitleProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const Tag = as;

  const save = () => {
    const trimmed = draft.trim();
    onSave(trimmed || title);
    setEditing(false);
  };

  const cancel = () => { setDraft(title); setEditing(false); };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); save(); } if (event.key === "Escape") cancel(); }}
          onBlur={save}
          aria-label="Section title"
          className="min-h-9 rounded-lg border border-blue-300 bg-white px-2.5 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none"
        />
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={save} className="text-xs font-semibold text-blue-700 hover:text-blue-800">Save</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={cancel} className="text-xs font-semibold text-slate-400 hover:text-slate-600">Cancel</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Tag className={className}>{title}</Tag>
      <button
        type="button"
        onClick={() => { setDraft(title); setEditing(true); }}
        aria-label={`Rename ${title}`}
        className="text-slate-300 transition hover:text-blue-600"
      >
        <PencilIcon />
      </button>
    </div>
  );
}
