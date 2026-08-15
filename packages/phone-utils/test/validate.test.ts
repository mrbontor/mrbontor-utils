import { describe, it, expect } from "vitest";
import { validatePhone, isValidPhone, isPossiblePhone } from "../src/validate";

describe("validatePhone", () => {
  it("returns valid result for valid Indonesian number", () => {
    const result = validatePhone("081234567890", "ID");
    expect(result.valid).toBe(true);
    expect(result.number).toBe("+6281234567890");
    expect(result.country).toBe("ID");
  });

  it("returns valid result for E.164 US number", () => {
    const result = validatePhone("+14155552671");
    expect(result.valid).toBe(true);
    expect(result.country).toBe("US");
  });

  it("returns invalid for empty string", () => {
    const result = validatePhone("", "ID");
    expect(result.valid).toBe(false);
    expect(result.number).toBeUndefined();
  });

  it("returns invalid for non-phone string", () => {
    const result = validatePhone("not-a-phone", "ID");
    expect(result.valid).toBe(false);
  });

  it("returns invalid for local number without country", () => {
    const result = validatePhone("081234567890");
    expect(result.valid).toBe(false);
  });

  it("returns invalid for all-zeros number", () => {
    const result = validatePhone("0000000000", "ID");
    expect(result.valid).toBe(false);
  });
});

describe("isValidPhone", () => {
  it("returns true for valid number", () => {
    expect(isValidPhone("081234567890", "ID")).toBe(true);
  });

  it("returns true for E.164 GB number", () => {
    expect(isValidPhone("+442079460018")).toBe(true);
  });

  it("returns false for invalid number", () => {
    expect(isValidPhone("not-a-phone", "ID")).toBe(false);
  });

  it("returns false for local number missing country", () => {
    expect(isValidPhone("081234567890")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isValidPhone("", "ID")).toBe(false);
  });
});

describe("isPossiblePhone", () => {
  it("returns true for a valid number", () => {
    expect(isPossiblePhone("081234567890", "ID")).toBe(true);
  });

  it("returns true for international number", () => {
    expect(isPossiblePhone("+6281234567890")).toBe(true);
  });

  it("returns false for nonsense input", () => {
    expect(isPossiblePhone("xyz", "ID")).toBe(false);
  });

  it("returns false for local number without country", () => {
    expect(isPossiblePhone("081234567890")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isPossiblePhone("", "ID")).toBe(false);
  });
});
