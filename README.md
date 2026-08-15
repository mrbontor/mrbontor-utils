# mrbontor-utils

A collection of lightweight, production-ready TypeScript utilities for modern JavaScript/Node.js projects.

All packages are published under the `@mrbontor` scope on npm and designed to be **tree-shakeable**, **fully typed**, and usable in both **ESM** and **CommonJS** environments.

## Packages

| Package                                           | Version                                                                                                           | Description                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`@mrbontor/utils-mask`](./packages/utils-mask)   | [![npm](https://img.shields.io/npm/v/@mrbontor/utils-mask)](https://www.npmjs.com/package/@mrbontor/utils-mask)   | Mask sensitive data like emails, phone numbers, and custom fields           |
| [`@mrbontor/phone-utils`](./packages/phone-utils) | [![npm](https://img.shields.io/npm/v/@mrbontor/phone-utils)](https://www.npmjs.com/package/@mrbontor/phone-utils) | Parse, normalize to E.164, validate, and format international phone numbers |

## Quick Start

Install the package you need:

```bash
# npm
npm install @mrbontor/utils-mask
npm install @mrbontor/phone-utils

# pnpm
pnpm add @mrbontor/utils-mask
pnpm add @mrbontor/phone-utils

# yarn
yarn add @mrbontor/utils-mask
yarn add @mrbontor/phone-utils
```

## Features

- **TypeScript-first** — full type definitions included
- **Dual build** — ships ESM and CommonJS
- **Tree-shakeable** — only import what you use
- **Tested** — every package has unit tests

## Repository Structure

```
mrbontor-utils/
├── packages/
│   ├── utils-mask/        # @mrbontor/utils-mask
│   └── phone-utils/       # @mrbontor/phone-utils
├── tooling/               # Shared configs (tsconfig, eslint, prettier, tsup, vitest)
├── .changeset/            # Versioning and changelog
└── .github/workflows/     # CI pipeline
```

## Development

Requires **Node.js >= 20.12** and **pnpm >= 10**.

```bash
# Clone and install
git clone https://github.com/mrbontor/mrbontor-utils.git
cd mrbontor-utils
pnpm install

# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm typecheck
```

## Contributing

1. Fork this repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes and add tests
4. Run `pnpm test && pnpm lint` to verify
5. Submit a pull request

When adding a new package, create it under `packages/` following the existing structure. No repository restructuring needed.

## License

[MIT](./LICENSE) © mrbontor
