"use client";

import { create } from "zustand";
import type { UserSettings } from "@/types";
import { db } from "@/db";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { getSettings } from "./services/get-settings";
import { updateSettings } from "./services/update-settings";

interface SettingsState {
  settings: UserSettings;
  loaded: boolean;
  load: () => Promise<void>;
  update: (updates: Partial<Omit<UserSettings, "id">>) => Promise<void>;
  replace: (settings: UserSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,

  load: async () => {
    const settings = await getSettings(db);
    set({ settings, loaded: true });
  },

  update: async (updates) => {
    const updated = await updateSettings(db, updates);
    set({ settings: updated });
  },

  replace: (settings) => set({ settings }),
}));
