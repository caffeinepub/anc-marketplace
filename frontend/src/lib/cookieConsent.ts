const COOKIE_CONSENT_KEY = 'anc_cookie_consent';

export function getCookieConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (stored === null) return null;
  
  try {
    return stored === 'true';
  } catch {
    return null;
  }
}

export function setCookieConsent(accepted: boolean): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(COOKIE_CONSENT_KEY, accepted.toString());
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}
