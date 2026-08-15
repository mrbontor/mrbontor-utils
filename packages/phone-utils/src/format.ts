import {
  parsePhoneNumber,
  type CountryCode as LibCountryCode,
  type NumberFormat,
} from "libphonenumber-js";
import { createError } from "./errors";
import type { CountryCode, FormatPhoneOptions, SafeResult } from "./types";

/**
 * Format a phone number using the specified output format.
 *
 * The input should be an E.164 string or any parseable number with a country.
 *
 * @param phoneNumber - Phone number string (E.164 preferred).
 * @param options     - { format, country? }
 * @throws {PhoneNumberParseError}
 *
 * @example
 * formatPhone('+6281234567890', { format: 'INTERNATIONAL' })
 * // '+62 812-3456-7890'
 *
 * formatPhone('+6281234567890', { format: 'NATIONAL', country: 'ID' })
 * // '0812-3456-7890'
 *
 * formatPhone('+6281234567890', { format: 'E.164' })
 * // '+6281234567890'
 */
export function formatPhone(
  phoneNumber: string,
  options: FormatPhoneOptions,
): string {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    throw createError(
      "INVALID_INPUT",
      "Phone number must be a non-null string",
    );
  }

  const { format, country } = options;

  try {
    const libPhone = parsePhoneNumber(
      phoneNumber.trim(),
      country ? (country.toUpperCase() as LibCountryCode) : undefined,
    );

    return libPhone.format(format as NumberFormat);
  } catch {
    throw createError(
      "FORMAT_FAILED",
      `Failed to format phone number "${phoneNumber}" as ${format}`,
    );
  }
}

/**
 * Format to NATIONAL representation.
 *
 * @example
 * formatNational('+6281234567890', 'ID') // '0812-3456-7890'
 */
export function formatNational(
  phoneNumber: string,
  country?: CountryCode,
): string {
  return formatPhone(phoneNumber, { format: "NATIONAL", country });
}

/**
 * Format to INTERNATIONAL representation.
 *
 * @example
 * formatInternational('+6281234567890') // '+62 812-3456-7890'
 */
export function formatInternational(phoneNumber: string): string {
  return formatPhone(phoneNumber, { format: "INTERNATIONAL" });
}

/**
 * Format to E.164.
 *
 * @example
 * formatE164('081234567890', 'ID') // '+6281234567890'
 */
export function formatE164(phoneNumber: string, country?: CountryCode): string {
  return formatPhone(phoneNumber, { format: "E.164", country });
}

/**
 * Format to RFC3966 URI.
 *
 * @example
 * formatRFC3966('+6281234567890') // 'tel:+6281234567890'
 */
export function formatRFC3966(phoneNumber: string): string {
  return formatPhone(phoneNumber, { format: "RFC3966" });
}

/**
 * Safe variant of formatPhone — never throws.
 */
export function safeFormatPhone(
  phoneNumber: unknown,
  options: FormatPhoneOptions,
): SafeResult<string> {
  try {
    return {
      success: true,
      data: formatPhone(phoneNumber as string, options),
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      success: false,
      error: { code: "FORMAT_FAILED", message },
    };
  }
}
