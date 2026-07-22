# @mrbontor/utils-mask

> Mask sensitive data — emails, phone numbers, and any custom field — with a simple, flexible API.

[![npm version](https://img.shields.io/npm/v/@mrbontor/utils-mask)](https://www.npmjs.com/package/@mrbontor/utils-mask)
[![license](https://img.shields.io/npm/l/@mrbontor/utils-mask)](https://github.com/mrbontor/mrbontor-utils/blob/main/LICENSE)

## Why?

Whenever you log request data, return user profiles from an API, or store audit records — sensitive fields like emails, phone numbers, and tokens should never appear in plain text. This package gives you a simple, composable way to mask them.

## Installation

```bash
npm install @mrbontor/utils-mask
# or
pnpm add @mrbontor/utils-mask
# or
yarn add @mrbontor/utils-mask
```

**Officially supports Node.js >= 20.12.** That said, since this package is built on pure functions with zero dependencies and no modern runtime APIs, it works on Node.js >= 14 in practice. If you're on an older version and it runs fine — great. Just note that older Node versions are not officially tested or supported.

## Import

This package ships both **ESM** and **CommonJS** builds. Your environment picks the right one automatically — no config needed.

**ESM** (TypeScript, modern Node.js, bundlers like Vite/webpack):

```typescript
import {
  DataMasker,
  maskEmail,
  maskPhone,
  maskSlice,
} from "@mrbontor/utils-mask";
```

**CommonJS** (legacy Node.js, `require`):

```javascript
const {
  DataMasker,
  maskEmail,
  maskPhone,
  maskSlice,
  maskIP,
  maskCard,
} = require("@mrbontor/utils-mask");
```

---

## Usage

### Standalone functions

The simplest way — call the strategy directly on a single value.

```typescript
import {
  maskEmail,
  maskPhone,
  maskSlice,
  maskIP,
  maskCard,
} from "@mrbontor/utils-mask";

maskEmail("johndoe@example.com"); // "jo***oe@example.com"
maskEmail("a@example.com"); // "*@example.com"

maskPhone("+6281234567890"); // "+628****7890"
maskPhone("081234567890"); // "081****890"

maskSlice("supersecret"); // "s*********t"
maskSlice("supersecret", {
  showStart: 3,
  showEnd: 3,
  maskChar: "#",
}); // "sup#####ret"

maskIP("192.168.1.100"); // "192.168.*.***"
maskIP("2001:db8:85a3:0:0:8a2e:370:7334"); // "2001:db8:*:*:*:*:*:*"

maskCard("4111111111111111"); // "411111 ****** 1111"
maskCard("4111 1111 1111 1111"); // "411111 ****** 1111"
maskCard("4111-1111-1111-1111"); // "411111 ****** 1111"
```

### DataMasker — mask entire objects

Use `DataMasker.mask()` when you need to mask fields inside objects or arrays. Define rules once and apply them to any data shape.

```typescript
import { DataMasker } from "@mrbontor/utils-mask";

const user = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+6281234567890",
  password: "supersecret",
  ip: "192.168.1.100",
  card: "4111111111111111",
};

const masked = DataMasker.mask(user, [
  { match: "email", strategy: "email" },
  { match: "phone", strategy: "phone" },
  { match: "password", strategy: "slice" },
  { match: "ip", strategy: "ip" },
  { match: "card", strategy: "card" },
]);

console.log(masked);
// {
//   name: "John Doe",
//   email: "jo***oe@example.com",
//   phone: "+628****7890",
//   password: "s*********t",
//   ip: "192.168.*.***",
//   card: "411111 ****** 1111"
// }
```

### Matching rules

`match` accepts three forms:

```typescript
// 1. Exact field name (string)
{ match: "email", strategy: "email" }

// 2. Regex — matches any key that fits the pattern
{ match: /phone/i, strategy: "phone" }

// 3. Function — full control over matching logic
{ match: (key, value) => key.startsWith("secret"), strategy: "slice" }
```

### Nested objects and arrays

Masking works recursively — nested objects and arrays of objects are handled automatically.

```typescript
const payload = {
  user: {
    email: "user@example.com",
    address: "123 Main St",
  },
  contacts: [{ phone: "+6281234567890" }, { phone: "+6289876543210" }],
};

const masked = DataMasker.mask(payload, [
  { match: "email", strategy: "email" },
  { match: /phone/i, strategy: "phone" },
]);
// user.email → masked, contacts[*].phone → masked
```

### Custom options

All built-in strategies accept options to control how much to show.

```typescript
maskEmail("johndoe@example.com", {
  showStart: 4, // show first 4 chars of local part
  showEnd: 0, // hide end of local part
  maskChar: "#", // use # instead of *
});
// "john####@example.com"

maskPhone("+6281234567890", {
  showStart: 4,
  showEnd: 4,
});
// "+6281****7890"

maskPhone("(021) 1234-5678", {
  preserveFormat: true, // keep spaces, dashes, parentheses
  showStart: 3,
  showEnd: 2,
});
// "(021) ****-**78"
```

### Custom strategies

Register your own named strategy and reuse it across rules.

```typescript
import { DataMasker } from "@mrbontor/utils-mask";

DataMasker.registerStrategy("redact", () => "[REDACTED]");

const result = DataMasker.mask(
  { apiKey: "sk-1234abcd", token: "eyJhbGci..." },
  [
    { match: "apiKey", strategy: "redact" },
    { match: "token", strategy: "redact" },
  ],
);
// { apiKey: "[REDACTED]", token: "[REDACTED]" }
```

You can also pass an inline function directly as a strategy:

```typescript
DataMasker.mask(data, [
  { match: "ssn", strategy: (val) => val.replace(/\d(?=\d{4})/g, "*") },
]);
```

### CommonJS full example

All of the above works identically in CJS — just swap the import syntax.

```javascript
const {
  DataMasker,
  maskEmail,
  maskPhone,
  maskIP,
  maskCard,
} = require("@mrbontor/utils-mask");

// standalone
console.log(maskEmail("johndoe@example.com")); // "jo***oe@example.com"
console.log(maskPhone("+6281234567890")); // "+628****7890"

// mask object
const user = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "+6281234567890",
};

const masked = DataMasker.mask(user, [
  { match: "email", strategy: "email" },
  { match: "phone", strategy: "phone" },
]);

console.log(masked);
// { name: "John Doe", email: "jo***oe@example.com", phone: "+628****7890" }
```

## API Reference

### `maskSlice(str, options?)`

General-purpose string masker. Shows a few characters at the start and end, masks the rest.

| Option      | Type     | Default | Description                              |
| ----------- | -------- | ------- | ---------------------------------------- |
| `maskChar`  | `string` | `"*"`   | Character to use for masking             |
| `showStart` | `number` | `1`     | How many characters to show at the start |
| `showEnd`   | `number` | `1`     | How many characters to show at the end   |

### `maskEmail(email, options?)`

Masks the local part of an email address (before `@`). The domain is always preserved.

Accepts the same options as `maskSlice`. Defaults are adaptive based on local part length.

### `maskPhone(phone, options?)`

Masks a phone number. Strips formatting by default, or preserves it with `preserveFormat: true`.

| Option           | Type      | Default | Description                                     |
| ---------------- | --------- | ------- | ----------------------------------------------- |
| `maskChar`       | `string`  | `"*"`   | Character to use for masking                    |
| `showStart`      | `number`  | `3`     | Digits to show at the start                     |
| `showEnd`        | `number`  | `2`     | Digits to show at the end                       |
| `preserveFormat` | `boolean` | `false` | Keep original formatting (spaces, dashes, etc.) |

### `maskIP(ip, options?)`

Masks an IP address. Keeps the first two octets (IPv4) or segments (IPv6) visible, masks the rest.

| Option     | Type     | Default | Description                  |
| ---------- | -------- | ------- | ---------------------------- |
| `maskChar` | `string` | `"*"`   | Character to use for masking |

### `maskCard(card, options?)`

Masks a credit/debit card number following PCI-DSS convention (show first 6, last 4). Accepts numbers with spaces or dashes and normalizes the output format.

| Option      | Type     | Default | Description                  |
| ----------- | -------- | ------- | ---------------------------- |
| `maskChar`  | `string` | `"*"`   | Character to use for masking |
| `showStart` | `number` | `6`     | Digits to show at the start  |
| `showEnd`   | `number` | `4`     | Digits to show at the end    |

### `DataMasker.mask(data, rules, globalOptions?)`

Recursively masks fields in an object or array according to the provided rules.

| Parameter       | Type            | Description                               |
| --------------- | --------------- | ----------------------------------------- |
| `data`          | `T`             | Any object or array                       |
| `rules`         | `MaskRule[]`    | List of masking rules                     |
| `globalOptions` | `GlobalOptions` | Optional default `maskChar` for all rules |

### `DataMasker.registerStrategy(name, fn)`

Registers a named custom strategy that can be referenced in rules by string name.

## License

[MIT](https://github.com/mrbontor/mrbontor-utils/blob/main/LICENSE) © mrbontor
