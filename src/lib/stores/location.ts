import { writable, type Writable } from 'svelte/store';

export type LocationState = 'unknown' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export interface LocationStore {
  state: LocationState;
  coords: { lat: number; lng: number } | null;
  errorMessage: string | null;
}

export const locationStore: Writable<LocationStore> = writable({
  state: 'unknown',
  coords: null,
  errorMessage: null,
});

export function setLocationState(state: LocationState, coords?: { lat: number; lng: number } | null, errorMessage?: string | null) {
  locationStore.update((s) => ({
    state,
    coords: coords !== undefined ? coords : s.coords,
    errorMessage: errorMessage !== undefined ? errorMessage : s.errorMessage,
  }));
}