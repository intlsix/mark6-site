// Shared in-memory token store for quick-submit flow
// Tokens are one-time-use with 10-minute expiry

const tokens = new Map<string, number>(); // token → expiresAt (ms)

/** Store a new token with expiry */
export function addToken(token: string, ttlMs: number) {
  tokens.set(token, Date.now() + ttlMs);
}

/** Validate and consume a token (one-time use). Returns true if valid. */
export function consumeToken(token: string): boolean {
  const expiresAt = tokens.get(token);
  if (!expiresAt) return false;
  tokens.delete(token); // one-time use
  if (Date.now() > expiresAt) return false;
  return true;
}

/** Clean expired tokens */
export function cleanExpiredTokens() {
  const now = Date.now();
  for (const [k, v] of tokens) if (v < now) tokens.delete(k);
}
