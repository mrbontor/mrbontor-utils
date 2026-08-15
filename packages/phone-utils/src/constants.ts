/**
 * Minimum length of a raw phone-number string worth attempting to parse.
 * Shorter strings are rejected early without hitting libphonenumber.
 */
export const MIN_PHONE_LENGTH = 3;

/**
 * Maximum reasonable raw input length (handles generous spacing / formatting).
 */
export const MAX_PHONE_LENGTH = 30;
