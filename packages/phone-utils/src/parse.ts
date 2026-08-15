import { parsePhoneNumber } from "libphonenumber-js";
import type { CountryCode as LibCountryCode } from "libphonenumber-js";
import { createError } from "./errors";
import { MIN_PHONE_LENGTH, MAX_PHONE_LENGTH } from "./constants";
import type { CountryCode, ParsedPhone, SafeResult } from "./types";

/**
 * Normalise a country-code string to uppercase.
 * Returns undefined when input is nullish.
 */
function normaliseCountry(country?: CountryCode): LibCountryCode | undefined {
  if (!country) return undefined;
  return country.toUpperCase() as LibCountryCode;
}

/**
 * Validate raw string input — throws PhoneNumberParseError on bad input.
 */
function assertValidInput(
  phone: unknown,
  country?: CountryCode,
): asserts phone is string {
  if (phone === null || phone === undefined || typeof phone !== "string") {
    throw createError(
      "INVALID_INPUT",
      "Phone number must be a non-null string",
    );
  }

  const trimmed = phone.trim();

  if (trimmed.length === 0) {
    throw createError("INVALID_INPUT", "Phone number must not be empty");
  }

  if (trimmed.length < MIN_PHONE_LENGTH) {
    throw createError(
      "INVALID_INPUT",
      `Phone number is too short (minimum ${MIN_PHONE_LENGTH} characters)`,
    );
  }

  if (trimmed.length > MAX_PHONE_LENGTH) {
    throw createError(
      "INVALID_INPUT",
      `Phone number is too long (maximum ${MAX_PHONE_LENGTH} characters)`,
    );
  }

  // Local numbers (no leading '+') require a country to be parseable
  if (!trimmed.startsWith("+") && !country) {
    throw createError(
      "MISSING_COUNTRY",
      "A country code is required for local phone numbers (numbers that do not start with '+')",
    );
  }
}

/**
 * Parse a phone number into a structured object.
 *
 * @param phoneNumber - Raw phone number string (local or international).
 * @param country     - ISO 3166-1 alpha-2 country code. Required for local numbers.
 * @throws {PhoneNumberParseError}
 *
 * @example
 * parsePhone('081234567890', 'ID')
 * // { country: 'ID', countryCallingCode: '62', nationalNumber: '81234567890',
 * //   number: '+6281234567890', possible: true, valid: true }
 */
export function parsePhone(
  phoneNumber: string,
  country?: CountryCode,
): ParsedPhone {
  assertValidInput(phoneNumber, country);

  const normalisedCountry = normaliseCountry(country);

  try {
    const parsed = parsePhoneNumber(phoneNumber.trim(), normalisedCountry);

    return {
      country: parsed.country as CountryCode | undefined,
      countryCallingCode: String(parsed.countryCallingCode),
      nationalNumber: String(parsed.nationalNumber),
      number: parsed.number,
      possible: parsed.isPossible(),
      valid: parsed.isValid(),
    };
  } catch {
    throw createError(
      "PARSE_FAILED",
      `Failed to parse phone number "${phoneNumber}"${country ? ` for country "${country}"` : ""}`,
    );
  }
}

/**
 * Safe variant — never throws, returns a discriminated union.
 *
 * @example
 * const result = safeParsePhone('081234567890', 'ID')
 * if (result.success) console.log(result.data.number)
 * else console.error(result.error.message)
 */
export function safeParsePhone(
  phoneNumber: unknown,
  country?: CountryCode,
): SafeResult<ParsedPhone> {
  try {
    return { success: true, data: parsePhone(phoneNumber as string, country) };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        success: false,
        error: { code: "PARSE_FAILED", message: err.message },
      };
    }
    return {
      success: false,
      error: { code: "PARSE_FAILED", message: "Unknown parse error" },
    };
  }
}
