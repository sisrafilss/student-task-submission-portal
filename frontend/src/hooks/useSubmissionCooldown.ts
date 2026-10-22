'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'submission_cooldown_until';
const DEFAULT_COOLDOWN_SECONDS = 60;

function getStoredRemaining(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const storedUntil = localStorage.getItem(STORAGE_KEY);
    if (!storedUntil) return 0;

    const untilTime = parseInt(storedUntil, 10);
    const now = Date.now();
    const diffSeconds = Math.ceil((untilTime - now) / 1000);

    if (diffSeconds <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      return 0;
    }
    return diffSeconds;
  } catch {
    return 0;
  }
}

export function useSubmissionCooldown(defaultSeconds = DEFAULT_COOLDOWN_SECONDS) {
  const [remainingSeconds, setRemainingSeconds] = useState(getStoredRemaining);

  // Tick countdown timer when remainingSeconds > 0
  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      const current = getStoredRemaining();
      setRemainingSeconds(current);
      if (current <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const startCooldown = useCallback((seconds = defaultSeconds) => {
    if (typeof window === 'undefined') return;
    try {
      const until = Date.now() + seconds * 1000;
      localStorage.setItem(STORAGE_KEY, until.toString());
      setRemainingSeconds(seconds);
    } catch {
      setRemainingSeconds(seconds);
    }
  }, [defaultSeconds]);

  const resetCooldown = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setRemainingSeconds(0);
  }, []);

  return {
    isCoolingDown: remainingSeconds > 0,
    remainingSeconds,
    startCooldown,
    resetCooldown,
  };
}
