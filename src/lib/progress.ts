// Local learning progress (device-only).
//
// The website keeps progress on the device too — the per-user
// server-side sync was stopped by Maalik in 2026-11-13, so nothing
// here talks to the server. Streak rules mirror the website:
// a day counts when any lesson is completed or watched; a broken
// streak can be restored within 24h, at most 3 times a month.

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "lp_progress_v1";

export interface ProgressState {
  completedLessonIds: string[];
  /** lessonId -> watched percent (0..100). */
  watchPct: Record<string, number>;
  /** Current streak in days. */
  streakCount: number;
  /** YYYY-MM-DD of the last active day, or null. */
  lastActiveDay: string | null;
  /** Restores used in the current calendar month. */
  restoresUsed: number;
  /** "YYYY-MM" the restoresUsed count belongs to. */
  restoreMonth: string | null;
  /** Daily goal in minutes. */
  goalMinutesPerDay: number;
}

export const emptyProgress: ProgressState = {
  completedLessonIds: [],
  watchPct: {},
  streakCount: 0,
  lastActiveDay: null,
  restoresUsed: 0,
  restoreMonth: null,
  goalMinutesPerDay: 30,
};

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return emptyProgress;
    return { ...emptyProgress, ...(JSON.parse(raw) as Partial<ProgressState>) };
  } catch {
    return emptyProgress;
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable — progress just won't persist.
  }
}
