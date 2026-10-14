// Versioned localStorage persistence with safe JSON handling.
// The app is frontend-only: this keeps player/teams/tournaments/notifications
// across reloads until a real backend exists.

const STORAGE_PREFIX = 'hextech-rift-v1:';

export function loadState<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode): fail silently.
  }
}

export function clearAllState(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const doomed: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) doomed.push(k);
    }
    doomed.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Ignore
  }
}
