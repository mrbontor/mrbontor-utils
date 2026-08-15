import {
  parsePhoneNumber,
  getCountryCallingCode as libGetCountryCallingCode,
  type CountryCode as LibCountryCode,
} from "libphonenumber-js";
import type { CountryCode } from "./types";

/**
 * Detect the country of an international phone number.
 *
 * Returns undefined for ambiguous or undetectable numbers rather than guessing.
 * Local numbers (no '+' prefix) without explicit country context cannot be resolved.
 *
 * @param phoneNumber - E.164 or international phone number string.
 * @returns ISO 3166-1 alpha-2 country code, or undefined.
 *
 * @example
 * getPhoneCountry('+6281234567890') // 'ID'
 * getPhoneCountry('+14155552671')   // 'US'
 * getPhoneCountry('081234567890')   // undefined  (local, no country context)
 */
export function getPhoneCountry(phoneNumber: string): CountryCode | undefined {
  if (!phoneNumber || typeof phoneNumber !== "string") return undefined;

  try {
    const parsed = parsePhoneNumber(phoneNumber.trim());
    return parsed.country as CountryCode | undefined;
  } catch {
    return undefined;
  }
}

/**
 * Look up the calling code for a country.
 *
 * @param country - ISO 3166-1 alpha-2 country code.
 * @returns Calling code string without '+' (e.g. "62"), or undefined for unknown countries.
 *
 * @example
 * getCountryCallingCode('ID') // '62'
 * getCountryCallingCode('US') // '1'
 * getCountryCallingCode('GB') // '44'
 */
export function getCountryCallingCode(
  country: CountryCode,
): string | undefined {
  if (!country || typeof country !== "string") return undefined;

  try {
    return String(
      libGetCountryCallingCode(country.toUpperCase() as LibCountryCode),
    );
  } catch {
    return undefined;
  }
}
