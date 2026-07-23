# @mrbontor/utils-mask

## 1.2.0

### Minor Changes

- a80f305: Extend `GlobalOptions` to support all `MaskOptions` fields (`maskChar`, `showStart`, `showEnd`, `preserveFormat`).

  Previously, `globalOptions` only accepted `maskChar`. Now all masking options can be set globally as a default fallback, with per-rule `options` still taking priority.

  ```typescript
  // before — only maskChar was supported globally
  DataMasker.mask(data, rules, { maskChar: "#" });

  // after — full options as global defaults
  DataMasker.mask(data, rules, { maskChar: "#", showStart: 2, showEnd: 2 });
  ```

  This is a non-breaking change — existing code using `{ maskChar }` continues to work as before.

## 1.1.0

### Minor Changes

- e544b12: update version
