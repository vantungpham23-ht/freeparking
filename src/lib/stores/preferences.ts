import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

const STORAGE_KEY = 'tmap-preferences';

export interface UserPreferences {
  hasSeenOnboarding: boolean;
  lastCity: string;
  hasEnabledLocation: boolean;
}

const defaultPreferences: UserPreferences = {
  hasSeenOnboarding: false,
  lastCity: 'kosice',
  hasEnabledLocation: false,
};

function loadPreferences(): UserPreferences {
  if (!browser) return defaultPreferences;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultPreferences;
}

export const preferences: Writable<UserPreferences> = writable(loadPreferences());

if (browser) {
  preferences.subscribe((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore
    }
  });
}

export function markOnboardingSeen() {
  preferences.update((p) => ({ ...p, hasSeenOnboarding: true }));
}

export function resetOnboarding() {
  preferences.update((p) => ({ ...p, hasSeenOnboarding: false }));
}

export function setLastCity(cityId: string) {
  preferences.update((p) => ({ ...p, lastCity: cityId }));
}

export function setLocationEnabled(enabled: boolean) {
  preferences.update((p) => ({ ...p, hasEnabledLocation: enabled }));
}