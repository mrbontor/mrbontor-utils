# @mrbontor/phone-utils

> Parse, normalize, validate, and format international phone numbers — with a simple, consistent API.

[![npm version](https://img.shields.io/npm/v/@mrbontor/phone-utils)](https://www.npmjs.com/package/@mrbontor/phone-utils)
[![license](https://img.shields.io/npm/l/@mrbontor/phone-utils)](https://github.com/mrbontor/mrbontor-utils/blob/main/LICENSE)

## Why?

Across services, phone-number formatting logic tends to get implemented independently — often hardcoded for Indonesia, never validated, and slightly different everywhere. This package gives you one reliable place for all of that: parse any format, normalize to **[E.164](https://en.wikipedia.org/wiki/E.164)**, validate against real country metadata, and format for display.

Built on [libphonenumber-js](https://gitlab.com/catamphetamine/libphonenumber-js) for metadata-backed accuracy. The underlying library is an implementation detail — you only ever interact with this package's API.

## Installation

```bash
npm install @mrbontor/phone-utils
# or
pnpm add @mrbontor/phone-utils
# or
yarn add @mrbontor/phone-utils
```

**Officially supports Node.js >= 20.12.** This package has a single runtime dependency (`libphonenumber-js`) that also runs on older Node versions. In practice it works on Node.js >= 14 — if you're on an older version and it runs fine, great. Just note that older Node versions are not officially tested or supported.

## Import

This package ships both **ESM** and **CommonJS** builds. Your environment picks the right one automatically — no config needed.

**ESM** (TypeScript, modern Node.js, bundlers like Vite/webpack):

```typescript
import {
  normalizePhone,
  validatePhone,
  formatPhone,
  parsePhone,
} from "@mrbontor/phone-utils";
```

**CommonJS** (legacy Node.js, `require`):

```javascript
const {
  normalizePhone,
  validatePhone,
  formatPhone,
  parsePhone,
  isValidPhone,
  getPhoneCountry,
  getCountryCallingCode,
} = require("@mrbontor/phone-utils");
```

---

## Core Concept

The package separates four distinct operations:

```
Input → Parse → Validate → Normalize (E.164) → Format at the boundary
```

The canonical representation is **[E.164](https://en.wikipedia.org/wiki/E.164)**. Store and exchange numbers in E.164; format for display only at the UI layer.

### Local vs International numbers

**Local numbers** (no `+` prefix) require a `country` argument — without it the number is ambiguous:

```typescript
normalizePhone("081234567890", "ID"); // ✅ '+6281234567890'
normalizePhone("081234567890"); // ❌ throws — missing country
```

**International numbers** (with `+` prefix) do not require a country argument:

```typescript
normalizePhone("+6281234567890"); // ✅ '+6281234567890'
```

Country codes follow [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) and are case-insensitive — `"ID"` and `"id"` both work.

---

## Usage

### Normalize to E.164

```typescript
import { normalizePhone } from "@mrbontor/phone-utils";

normalizePhone("081234567890", "ID"); // "+6281234567890"
normalizePhone("0812-3456-7890", "ID"); // "+6281234567890"
normalizePhone("0812 3456 7890", "ID"); // "+6281234567890"
normalizePhone("+6281234567890"); // "+6281234567890"
normalizePhone("(415) 555-2671", "US"); // "+14155552671"
normalizePhone("020 7946 0018", "GB"); // "+442079460018"
```

### Parse into structured data

```typescript
import { parsePhone } from "@mrbontor/phone-utils";

parsePhone("081234567890", "ID");
// {
//   country: "ID",
//   countryCallingCode: "62",
//   nationalNumber: "81234567890",
//   number: "+6281234567890",
//   possible: true,
//   valid: true
// }
```

### Validate

```typescript
import {
  validatePhone,
  isValidPhone,
  isPossiblePhone,
} from "@mrbontor/phone-utils";

// Full validation result
validatePhone("081234567890", "ID");
// { valid: true, number: "+6281234567890", country: "ID" }

validatePhone("not-a-phone", "ID");
// { valid: false }

// Boolean shorthand
isValidPhone("081234567890", "ID"); // true
isValidPhone("0000000", "ID"); // false

// Lightweight length/structure check (faster, no full validation)
isPossiblePhone("081234567890", "ID"); // true
```

### Format for display

```typescript
import {
  formatPhone,
  formatNational,
  formatInternational,
  formatE164,
  formatRFC3966,
} from "@mrbontor/phone-utils";

formatPhone("+6281234567890", { format: "INTERNATIONAL" }); // "+62 812-3456-7890"
formatPhone("+6281234567890", { format: "NATIONAL", country: "ID" }); // "0812-3456-7890"
formatPhone("+6281234567890", { format: "E.164" }); // "+6281234567890"
formatPhone("+6281234567890", { format: "RFC3966" }); // "tel:+6281234567890"

// Convenience wrappers
formatNational("+6281234567890", "ID"); // "0812-3456-7890"
formatInternational("+6281234567890"); // "+62 812-3456-7890"
formatE164("081234567890", "ID"); // "+6281234567890"
formatRFC3966("+6281234567890"); // "tel:+6281234567890"
```

### Country utilities

```typescript
import { getPhoneCountry, getCountryCallingCode } from "@mrbontor/phone-utils";

getPhoneCountry("+6281234567890"); // "ID"
getPhoneCountry("+14155552671"); // "US"
getPhoneCountry("+442079460018"); // "GB"
getPhoneCountry("081234567890"); // undefined — local number, no country context

getCountryCallingCode("ID"); // "62"
getCountryCallingCode("US"); // "1"
getCountryCallingCode("GB"); // "44"
```

### Safe (non-throwing) variants

Every core function has a `safe*` variant that returns a discriminated union instead of throwing. Useful in validation pipelines and middleware.

```typescript
import {
  safeNormalizePhone,
  safeParsePhone,
  safeFormatPhone,
  safeValidatePhone,
} from "@mrbontor/phone-utils";

const result = safeNormalizePhone("081234567890", "ID");

if (result.success) {
  console.log(result.data); // "+6281234567890"
} else {
  console.error(result.error.code, result.error.message);
}
```

Applies to: `safeNormalizePhone`, `safeParsePhone`, `safeFormatPhone`, `safeValidatePhone`.

### CommonJS full example

```javascript
const {
  normalizePhone,
  isValidPhone,
  formatNational,
  getPhoneCountry,
} = require("@mrbontor/phone-utils");

// Normalize
console.log(normalizePhone("081234567890", "ID")); // "+6281234567890"

// Validate
console.log(isValidPhone("+14155552671")); // true
console.log(isValidPhone("0000000", "ID")); // false

// Format
console.log(formatNational("+6281234567890", "ID")); // "0812-3456-7890"

// Detect country
console.log(getPhoneCountry("+442079460018")); // "GB"
```

---

## Error Handling

Functions throw `PhoneNumberParseError` with a typed `code` property:

```typescript
import { normalizePhone, PhoneNumberParseError } from "@mrbontor/phone-utils";

try {
  normalizePhone("081234567890"); // local number — missing country
} catch (err) {
  if (err instanceof PhoneNumberParseError) {
    console.log(err.code); // "MISSING_COUNTRY"
    console.log(err.message); // human-readable description
  }
}
```

| Code              | When                                                   |
| ----------------- | ------------------------------------------------------ |
| `INVALID_INPUT`   | `null`, `undefined`, empty string, or non-string input |
| `MISSING_COUNTRY` | Local number (no `+`) without a country argument       |
| `PARSE_FAILED`    | Input could not be parsed as a phone number            |
| `FORMAT_FAILED`   | Parsed number could not be formatted                   |

Use `safe*` variants to avoid try/catch entirely.

---

## API Reference

### `normalizePhone(phoneNumber, country?)`

Normalizes to E.164. Throws `PhoneNumberParseError` on failure.

| Parameter     | Type     | Description                                                 |
| ------------- | -------- | ----------------------------------------------------------- |
| `phoneNumber` | `string` | Raw phone number (local or international)                   |
| `country`     | `string` | ISO 3166-1 alpha-2 country code. Required for local numbers |

### `parsePhone(phoneNumber, country?)`

Returns a structured parse result.

| Field                | Type                  | Description                            |
| -------------------- | --------------------- | -------------------------------------- |
| `country`            | `string \| undefined` | ISO country code                       |
| `countryCallingCode` | `string`              | Calling code without `+`               |
| `nationalNumber`     | `string`              | Subscriber number without country code |
| `number`             | `string`              | E.164 representation                   |
| `possible`           | `boolean`             | Passes basic length/structure check    |
| `valid`              | `boolean`             | Passes full libphonenumber validation  |

### `validatePhone(phoneNumber, country?)`

Returns `{ valid, number?, country? }`. Never throws.

### `isValidPhone(phoneNumber, country?)`

Returns `true` only when full validation passes. Never throws.

### `isPossiblePhone(phoneNumber, country?)`

Lightweight check — passes when number structure is plausible. Faster than full validation. Never throws.

### `formatPhone(phoneNumber, options)`

Formats a phone number using the specified output format.

| Option    | Type                                                    | Description                                                     |
| --------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| `format`  | `"E.164" \| "INTERNATIONAL" \| "NATIONAL" \| "RFC3966"` | Output format                                                   |
| `country` | `string`                                                | ISO country code. Needed for `NATIONAL` format on local numbers |

### Convenience formatters

| Function                          | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `formatNational(phone, country?)` | National format (e.g. `0812-3456-7890`)         |
| `formatInternational(phone)`      | International format (e.g. `+62 812-3456-7890`) |
| `formatE164(phone, country?)`     | E.164 (e.g. `+6281234567890`)                   |
| `formatRFC3966(phone)`            | RFC3966 URI (e.g. `tel:+6281234567890`)         |

### `getPhoneCountry(phoneNumber)`

Detects country from an international number. Returns `undefined` for local or ambiguous numbers — never guesses.

### `getCountryCallingCode(country)`

Returns the calling code string for an ISO country code. Returns `undefined` for unknown countries.

### Safe variants

| Function                              | Wraps            |
| ------------------------------------- | ---------------- |
| `safeNormalizePhone(phone, country?)` | `normalizePhone` |
| `safeParsePhone(phone, country?)`     | `parsePhone`     |
| `safeFormatPhone(phone, options)`     | `formatPhone`    |
| `safeValidatePhone(phone, country?)`  | `validatePhone`  |

All safe variants return `{ success: true, data: T } | { success: false, error: { code, message } }`.

---

## Supported Countries

All countries supported by `libphonenumber-js` metadata are supported — virtually every internationally-dialing country.

---

## License

[MIT](https://github.com/mrbontor/mrbontor-utils/blob/main/LICENSE) © mrbontor
