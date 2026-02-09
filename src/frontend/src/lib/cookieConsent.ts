const COOKIE_CONSENT_KEY = 'anc-cookie-consent';

export type CookieConsentStatus = 'unknown' | 'accepted' | 'rejected';

export function getCookieConsent(): CookieConsentStatus {
  if (typeof window === 'undefined') return 'unknown';
  
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (stored === 'accepted' || stored === 'rejected') {
    return stored as CookieConsentStatus;
  }
  return 'unknown';
}

export function setCookieConsent(status: 'accepted' | 'rejected'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, status);
}

export function shouldShowCookieConsent(): boolean {
  return getCookieConsent() === 'unknown';
}
