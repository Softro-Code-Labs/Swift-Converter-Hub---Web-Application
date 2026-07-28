'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';

export type ConsentChoice = 'accepted' | 'declined';

interface ConsentContextValue {
  /** null = no choice recorded yet (or not read from storage yet) */
  consent: ConsentChoice | null;
  /** true once we've checked localStorage - avoids flashing the banner
   * before we know whether a choice was already made. */
  isLoaded: boolean;
  accept: () => void;
  decline: () => void;
  /** Reopen the choice - e.g. a "Cookie preferences" link in the footer. */
  reset: () => void;
}

const STORAGE_KEY = 'swiftconverterhub-consent';

const ConsentContext = createContext<ConsentContextValue | null>(null);

// --- localStorage as an external store ---------------------------------
// Read via useSyncExternalStore instead of useEffect+useState: localStorage
// isn't available during SSR, and this keeps the read/write in sync with
// React without a setState-in-effect render cascade.

let listeners: (() => void)[] = [];

function notifyListeners() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener('storage', listener);
  };
}

function readConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'accepted' || stored === 'declined' ? stored : null;
  } catch {
    // localStorage unavailable (private browsing, disabled, etc). Treat
    // as undecided - non-essential scripts simply stay off this session.
    return null;
  }
}

function writeConsent(value: ConsentChoice | null) {
  try {
    if (value === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // Choice still applies for this session even if it can't be saved.
  }
  notifyListeners();
}

function subscribeOnce() {
  return () => {};
}

/**
 * Gates non-essential scripts (ads + analytics) behind an explicit user
 * choice. Shows a consent banner first; essential features are unaffected,
 * but optional services only load once the user accepts.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(
    subscribe,
    readConsent,
    () => null,
  );
  // True once hydrated on the client - the server snapshot is always false.
  const isLoaded = useSyncExternalStore(
    subscribeOnce,
    () => true,
    () => false,
  );

  const accept = useCallback(() => writeConsent('accepted'), []);
  const decline = useCallback(() => writeConsent('declined'), []);
  const reset = useCallback(() => writeConsent(null), []);

  return (
    <ConsentContext.Provider
      value={{ consent, isLoaded, accept, decline, reset }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error('useConsent must be used within a <ConsentProvider>');
  }
  return ctx;
}
