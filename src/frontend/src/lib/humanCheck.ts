const HUMAN_CHECK_KEY = 'anc-human-check';
const HUMAN_CHECK_TTL = 30 * 60 * 1000; // 30 minutes

export interface HumanCheckData {
  verified: boolean;
  timestamp: number;
}

export function getHumanCheckStatus(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = sessionStorage.getItem(HUMAN_CHECK_KEY);
    if (!stored) return false;
    
    const data: HumanCheckData = JSON.parse(stored);
    const now = Date.now();
    
    // Check if verification is still valid (within TTL)
    if (data.verified && (now - data.timestamp) < HUMAN_CHECK_TTL) {
      return true;
    }
    
    // Expired, clear it
    sessionStorage.removeItem(HUMAN_CHECK_KEY);
    return false;
  } catch {
    return false;
  }
}

export function setHumanCheckVerified(): void {
  if (typeof window === 'undefined') return;
  
  const data: HumanCheckData = {
    verified: true,
    timestamp: Date.now(),
  };
  
  sessionStorage.setItem(HUMAN_CHECK_KEY, JSON.stringify(data));
}

export function clearHumanCheck(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(HUMAN_CHECK_KEY);
}
