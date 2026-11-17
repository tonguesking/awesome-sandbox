/**
 * A price that was read a year ago is not a current price. These helpers let
 * the UI say when a "verified" tag is old instead of letting the word imply
 * that the rate was checked recently.
 */

export const STALE_AFTER_DAYS = 90;

export function daysSince(iso: string, now: Date = new Date()): number | null {
  const then = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(then)) {
    return null;
  }
  const diff = now.getTime() - then;
  return Math.floor(diff / 86_400_000);
}

export function isStaleVerification(iso: string | undefined, now: Date = new Date()): boolean {
  if (!iso) {
    return false;
  }
  const days = daysSince(iso, now);
  return days !== null && days > STALE_AFTER_DAYS;
}

export function formatVerifiedOn(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });
}
