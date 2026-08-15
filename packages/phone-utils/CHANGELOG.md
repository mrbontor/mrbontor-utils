# @mrbontor/phone-utils

## 0.1.0

### Minor Changes

- 2306d3c: Initial release of `@mrbontor/phone-utils`.

  Framework-independent phone number utility — parse, normalize to E.164, validate, and format international phone numbers using `libphonenumber-js` as the underlying metadata engine.

  ### Public API
  - `normalizePhone` / `safeNormalizePhone` — normalize to E.164
  - `parsePhone` / `safeParsePhone` — structured parse result
  - `validatePhone` / `isValidPhone` / `isPossiblePhone` / `safeValidatePhone` — validation helpers
  - `formatPhone` / `formatNational` / `formatInternational` / `formatE164` / `formatRFC3966` / `safeFormatPhone` — formatting
  - `getPhoneCountry` — detect country from international number
  - `getCountryCallingCode` — calling code lookup
  - `PhoneNumberParseError` — typed error class with `code` property
