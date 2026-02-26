"use client";

import { create } from "zustand";
import type { TimeEntry } from "@/types";
import { db } from "@/db";
import { createEntry } from "./services/create-entry";
import { updateEntry } from "./services/update-entry";
import { deleteEntry } from "./services/delete-entry";
import { getEntries } from "./services/get-entries";
import { getEntriesByDateRange } from "./services/get-entries-by-date-range";

interface EntriesState {
  entries: TimeEntry[];
  loaded: boolean;
  load: () => Promise<void>;
  add: (data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) => Promise<TimeEntry>;
  update: (id: string, updates: Partial<Omit<TimeEntry, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getByDateRange: (start: string, end: string) => Promise<TimeEntry[]>;
  replaceAll: (entries: TimeEntry[]) => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  loaded: false,

  load: async () => {
    const entries = await getEntries(db);
    set({ entries, loaded: true });
  },

  add: async (data) => {
    const entry = await createEntry(db, data);
    set((state) => ({ entries: [entry, ...state.entries] }));
    return entry;
  },

  update: async (id, updates) => {
    const updated = await updateEntry(db, id, updates);
    set((state) => ({
      entries: state.entries.map((e) => (e.id === id ? updated : e)),
    }));
  },

  remove: async (id) => {
    await deleteEntry(db, id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },

  getByDateRange: async (start, end) => {
    return getEntriesByDateRange(db, start, end);
  },

  replaceAll: (entries) => set({ entries }),
}));
