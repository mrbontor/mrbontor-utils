import { safeParsePhone } from "./parse";
import type { CountryCode, ValidatePhoneResult, SafeResult } from "./types";

/**
 * Full validation — checks libphonenumber validity rules for the country.
 *
 * @param phoneNumber - Raw phone number string.
 * @param country     - ISO 3166-1 alpha-2 country code. Required for local numbers.
 * @returns { valid, number, country }
 *
 * @example
 * validatePhone('081234567890', 'ID')
 * // { valid: true, number: '+6281234567890', country: 'ID' }
 *
 * validatePhone('0000000', 'ID')
 * // { valid: false }
 */
export function validatePhone(
  phoneNumber: string,
  country?: CountryCode,
): ValidatePhoneResult {
  const result = safeParsePhone(phoneNumber, country);

  if (!result.success) {
    return { valid: false };
  }

  const { data } = result;

  if (!data.valid) {
    return { valid: false };
  }

  return {
    valid: true,
    number: data.number,
    country: data.country,
  };
}

/**
 * Convenience boolean — returns true only when the number passes full validation.
 *
 * @example
 * isValidPhone('081234567890', 'ID') // true
 * isValidPhone('0000000', 'ID')       // false
 */
export function isValidPhone(
  phoneNumber: string,
  country?: CountryCode,
): boolean {
  return validatePhone(phoneNumber, country).valid;
}

/**
 * Lightweight possibility check — passes when the number length/structure is
 * plausible for the country, but does not perform full validation.
 *
 * Useful as a quick pre-check before hitting heavier validation logic.
 *
 * @example
 * isPossiblePhone('081234567890', 'ID') // true
 */
export function isPossiblePhone(
  phoneNumber: string,
  country?: CountryCode,
): boolean {
  const result = safeParsePhone(phoneNumber, country);
  if (!result.success) return false;
  return result.data.possible;
}

/**
 * Safe variant of validatePhone — never throws.
 */
export function safeValidatePhone(
  phoneNumber: unknown,
  country?: CountryCode,
): SafeResult<ValidatePhoneResult> {
  try {
    return {
      success: true,
      data: validatePhone(phoneNumber as string, country),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: { code: "PARSE_FAILED", message },
    };
  }
}
