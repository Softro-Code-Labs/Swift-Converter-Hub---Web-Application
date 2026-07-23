'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
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

/**
 * Gates non-essential scripts (ads + analytics) behind an explicit user
 * choice. Shows a consent banner first; essential features are unaffected,
 * but optional services only load once the user accepts.
 */
export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentChoice | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        // Standard hydration-safe pattern: localStorage can't be read
        // during SSR, so this snapshot-on-mount runs once client-side.
        setConsentState(stored);
      }
    } catch {
      // localStorage unavailable (private browsing, disabled, etc). Treat
      // as undecided - non-essential scripts simply stay off this session.
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persist = useCallback((value: ConsentChoice) => {
    setConsentState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Choice still applies for this session even if it can't be saved.
    }
  }, []);

  const accept = useCallback(() => persist('accepted'), [persist]);
  const decline = useCallback(() => persist('declined'), [persist]);
  const reset = useCallback(() => {
    setConsentState(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
  }, []);

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
