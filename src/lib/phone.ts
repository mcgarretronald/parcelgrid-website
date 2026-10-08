/**
 * Kenyan mobile validation — mirrors ParcelGrid app rules.
 * Accepts: 07XXXXXXXX / 01XXXXXXXX / 7XXXXXXXX / 1XXXXXXXX / 254… / +254…
 */

export function digitsOnly(value: string): string {
  return String(value || "").replace(/\D/g, "");
}

/** Valid local 10-digit form starting 07 or 01 (covers 070–079 and 010–019). */
export function isValidKenyaMobile(raw: string): boolean {
  const digits = digitsOnly(raw);
  if (/^254[17]\d{8}$/.test(digits)) return true;
  if (/^0[17]\d{8}$/.test(digits)) return true;
  if (/^[17]\d{8}$/.test(digits)) return true;
  return false;
}

/** Normalize to 254XXXXXXXXX for payment / order APIs. */
export function normalizeKenyaMobile(raw: string): string | null {
  const digits = digitsOnly(raw);
  if (!digits) return null;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

export function kenyaMobileError(raw: string): string | null {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return "Phone number is required";
  const digits = digitsOnly(trimmed);

  if (digits.startsWith("0") && digits.length >= 2 && !/^0[17]/.test(digits)) {
    return "After 0, the next digit must be 7 or 1 (e.g. 07… or 01…)";
  }
  if (digits.startsWith("254") && digits.length > 3 && !/^254[17]/.test(digits)) {
    return "After 254, the next digit must be 7 or 1";
  }
  if (digits.length < 9) return "Phone number is too short — use 07XXXXXXXX or 01XXXXXXXX";
  if (digits.startsWith("0") && digits.length > 10) {
    return "Phone number is too long — use 10 digits (07… or 01…)";
  }
  if (digits.startsWith("254") && digits.length > 12) {
    return "Phone number is too long — use 254 plus 9 digits";
  }
  if (!digits.startsWith("0") && !digits.startsWith("254") && digits.length > 9) {
    return "Phone number is too long";
  }
  if (!isValidKenyaMobile(trimmed)) {
    return "Enter a valid Kenyan mobile (07… / 01… or 254…)";
  }
  return null;
}
