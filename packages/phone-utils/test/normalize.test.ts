import { describe, it, expect } from "vitest";
import { normalizePhone, safeNormalizePhone } from "../src/normalize";
import { PhoneNumberParseError } from "../src/errors";

describe("normalizePhone", () => {
  // ─── Indonesia ───────────────────────────────────────────────────────────────
  describe("Indonesia (ID)", () => {
    it("normalises local number with leading 0", () => {
      expect(normalizePhone("081234567890", "ID")).toBe("+6281234567890");
    });

    it("normalises local number with dashes", () => {
      expect(normalizePhone("0812-3456-7890", "ID")).toBe("+6281234567890");
    });

    it("normalises local number with spaces", () => {
      expect(normalizePhone("0812 3456 7890", "ID")).toBe("+6281234567890");
    });

    it("normalises international number without country arg", () => {
      expect(normalizePhone("+6281234567890")).toBe("+6281234567890");
    });

    it("normalises international number with country arg", () => {
      expect(normalizePhone("+6281234567890", "ID")).toBe("+6281234567890");
    });

    it("accepts lowercase country code", () => {
      expect(normalizePhone("081234567890", "id")).toBe("+6281234567890");
    });
  });

  // ─── United States ───────────────────────────────────────────────────────────
  describe("United States (US)", () => {
    it("normalises E.164 US number", () => {
      expect(normalizePhone("+14155552671")).toBe("+14155552671");
    });

    it("normalises national US number with country", () => {
      expect(normalizePhone("(415) 555-2671", "US")).toBe("+14155552671");
    });
  });

  // ─── United Kingdom ──────────────────────────────────────────────────────────
  describe("United Kingdom (GB)", () => {
    it("normalises local GB number", () => {
      expect(normalizePhone("020 7946 0018", "GB")).toBe("+442079460018");
    });

    it("normalises international GB number", () => {
      expect(normalizePhone("+442079460018")).toBe("+442079460018");
    });
  });

  // ─── Japan ───────────────────────────────────────────────────────────────────
  describe("Japan (JP)", () => {
    it("normalises JP number", () => {
      expect(normalizePhone("+819012345678")).toBe("+819012345678");
    });
  });

  // ─── Singapore ───────────────────────────────────────────────────────────────
  describe("Singapore (SG)", () => {
    it("normalises SG number", () => {
      expect(normalizePhone("+6581234567")).toBe("+6581234567");
    });
  });

  // ─── Malaysia ────────────────────────────────────────────────────────────────
  describe("Malaysia (MY)", () => {
    it("normalises MY number", () => {
      expect(normalizePhone("+60123456789")).toBe("+60123456789");
    });
  });

  // ─── Error cases ─────────────────────────────────────────────────────────────
  describe("error handling", () => {
    it("throws MISSING_COUNTRY for local number without country", () => {
      expect(() => normalizePhone("081234567890")).toThrow(
        PhoneNumberParseError,
      );
      expect(() => normalizePhone("081234567890")).toThrow(
        /country code is required/i,
      );
    });

    it("throws INVALID_INPUT for empty string", () => {
      expect(() => normalizePhone("", "ID")).toThrow(PhoneNumberParseError);
    });

    it("throws INVALID_INPUT for non-phone string", () => {
      expect(() => normalizePhone("not-a-phone", "ID")).toThrow(
        PhoneNumberParseError,
      );
    });

    it("throws INVALID_INPUT for too-short string", () => {
      expect(() => normalizePhone("1", "ID")).toThrow(PhoneNumberParseError);
    });
  });
});

// ─── safeNormalizePhone ───────────────────────────────────────────────────────
describe("safeNormalizePhone", () => {
  it("returns success result for valid number", () => {
    const result = safeNormalizePhone("081234567890", "ID");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("+6281234567890");
    }
  });

  it("returns failure result for invalid input", () => {
    const result = safeNormalizePhone("not-a-phone", "ID");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBeTruthy();
    }
  });

  it("returns failure for null input", () => {
    const result = safeNormalizePhone(null, "ID");
    expect(result.success).toBe(false);
  });

  it("returns failure for undefined input", () => {
    const result = safeNormalizePhone(undefined, "ID");
    expect(result.success).toBe(false);
  });

  it("returns failure for numeric input", () => {
    const result = safeNormalizePhone(123 as unknown as string, "ID");
    expect(result.success).toBe(false);
  });
});
