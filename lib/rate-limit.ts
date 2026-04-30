const rateMap = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  if (rateMap.size > 10000) {
    for (const [key, val] of rateMap) {
      if (now > val.resetAt) rateMap.delete(key);
    }
  }

  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}
