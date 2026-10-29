import { timingSafeEqual } from "crypto";

// The studio URL is /studio/<STUDIO_KEY>. The key is also re-checked on every write,
// so knowing the page's HTML is not enough to change anything.
export function isStudioKey(key: string | undefined) {
  const secret = process.env.STUDIO_KEY;
  if (!secret || !key || secret.length < 16) return false;
  const a = Buffer.from(key);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
