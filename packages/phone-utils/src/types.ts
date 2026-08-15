/**
 * ISO 3166-1 alpha-2 country code (e.g. "ID", "US", "GB").
 * The library accepts both upper and lower case — it normalises internally.
 */
export type CountryCode = string;

/** Supported output formats for formatPhone(). */
export type PhoneFormat = "E.164" | "INTERNATIONAL" | "NATIONAL" | "RFC3966";

/** Structured result returned by parsePhone(). */
export interface ParsedPhone {
  /** ISO 3166-1 alpha-2 country code, undefined when undetectable. */
  country: CountryCode | undefined;
  /** Country calling code without the leading '+'. */
  countryCallingCode: string;
  /** National subscriber number without country code. */
  nationalNumber: string;
  /** Normalised E.164 representation ('+' prefix). */
  number: string;
  /** True when the number length is within the possible range for its country. */
  possible: boolean;
  /** True when the number passes full libphonenumber validation. */
  valid: boolean;
}

/** Result returned by validatePhone(). */
export interface ValidatePhoneResult {
  valid: boolean;
  /** Normalised E.164 number — present only when valid is true. */
  number?: string;
  /** ISO country code — present only when detectable. */
  country?: CountryCode;
}

/** Options accepted by formatPhone(). */
export interface FormatPhoneOptions {
  format: PhoneFormat;
  /**
   * Required when format is "NATIONAL" and the input is a local number
   * without a calling code prefix.
   */
  country?: CountryCode;
}

/** Discriminated union returned by safe* variants. */
export type SafeResult<T> =
  { success: true; data: T } | { success: false; error: PhoneError };

/** Structured error thrown / returned by this library. */
export interface PhoneError {
  code: PhoneErrorCode;
  message: string;
}

export type PhoneErrorCode =
  "INVALID_INPUT" | "MISSING_COUNTRY" | "PARSE_FAILED" | "FORMAT_FAILED";
