"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "documaxxer:suggestions:v1";
const MAX_PER_FIELD = 20;

type SuggestionStore = Record<string, string[]>;

function readStore(): SuggestionStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SuggestionStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: SuggestionStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // private browsing / quota — suggestions are a nice-to-have, fail silently
  }
}

/** Suggestions for one field key, persisted across visits. Most-recent-first, deduped, capped. */
export function useFieldSuggestions(fieldKey: string): { suggestions: string[]; record: (value: string) => void } {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestions(readStore()[fieldKey] ?? []);
  }, [fieldKey]);

  const record = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const store = readStore();
    const existing = store[fieldKey] ?? [];
    const deduped = [trimmed, ...existing.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_PER_FIELD);
    store[fieldKey] = deduped;
    writeStore(store);
    setSuggestions(deduped);
  }, [fieldKey]);

  return { suggestions, record };
}