import { parsePhone, safeParsePhone } from "./parse";
import type { CountryCode, SafeResult } from "./types";

/**
 * Normalise a phone number to E.164 format.
 *
 * Local numbers (no '+' prefix) require a country argument.
 * International numbers ('+' prefix) do not.
 *
 * @param phoneNumber - Raw phone number string.
 * @param country     - ISO 3166-1 alpha-2 country code. Required for local numbers.
 * @returns E.164 string (e.g. "+6281234567890").
 * @throws {PhoneNumberParseError}
 *
 * @example
 * normalizePhone('081234567890', 'ID') // '+6281234567890'
 * normalizePhone('+6281234567890')      // '+6281234567890'
 * normalizePhone('(415) 555-2671', 'US') // '+14155552671'
 */
export function normalizePhone(
  phoneNumber: string,
  country?: CountryCode,
): string {
  const parsed = parsePhone(phoneNumber, country);
  return parsed.number;
}

/**
 * Safe variant — never throws.
 *
 * @example
 * const result = safeNormalizePhone('081234567890', 'ID')
 * if (result.success) console.log(result.data) // '+6281234567890'
 */
export function safeNormalizePhone(
  phoneNumber: unknown,
  country?: CountryCode,
): SafeResult<string> {
  const result = safeParsePhone(phoneNumber, country);
  if (!result.success) return result;
  return { success: true, data: result.data.number };
}
