import { describe, it, expect } from "vitest";
import { parsePhone, safeParsePhone } from "../src/parse";
import { PhoneNumberParseError } from "../src/errors";

describe("parsePhone", () => {
  it("parses Indonesian local number", () => {
    const result = parsePhone("081234567890", "ID");
    expect(result.country).toBe("ID");
    expect(result.countryCallingCode).toBe("62");
    expect(result.nationalNumber).toBe("81234567890");
    expect(result.number).toBe("+6281234567890");
    expect(result.valid).toBe(true);
    expect(result.possible).toBe(true);
  });

  it("parses international number without country arg", () => {
    const result = parsePhone("+6281234567890");
    expect(result.country).toBe("ID");
    expect(result.number).toBe("+6281234567890");
    expect(result.valid).toBe(true);
  });

  it("parses US number", () => {
    const result = parsePhone("+14155552671");
    expect(result.country).toBe("US");
    expect(result.countryCallingCode).toBe("1");
    expect(result.valid).toBe(true);
  });

  it("parses GB number", () => {
    const result = parsePhone("+442079460018");
    expect(result.country).toBe("GB");
    expect(result.countryCallingCode).toBe("44");
    expect(result.valid).toBe(true);
  });

  it("sets valid to false for a too-short number", () => {
    // 4 digits — too short to be a real phone number for any country
    const result = safeParsePhone("+621234");
    if (result.success) {
      expect(result.data.valid).toBe(false);
    } else {
      expect(result.success).toBe(false);
    }
  });

  it("throws MISSING_COUNTRY for local number without country", () => {
    const err = (() => {
      try {
        parsePhone("081234567890");
        return null;
      } catch (e) {
        return e;
      }
    })();
    expect(err).toBeInstanceOf(PhoneNumberParseError);
    expect((err as PhoneNumberParseError).code).toBe("MISSING_COUNTRY");
  });

  it("throws INVALID_INPUT for empty string", () => {
    expect(() => parsePhone("", "ID")).toThrow(PhoneNumberParseError);
  });

  it("throws INVALID_INPUT for null", () => {
    expect(() => parsePhone(null as unknown as string, "ID")).toThrow(
      PhoneNumberParseError,
    );
  });

  it("throws INVALID_INPUT for undefined", () => {
    expect(() => parsePhone(undefined as unknown as string, "ID")).toThrow(
      PhoneNumberParseError,
    );
  });

  it("throws PARSE_FAILED for nonsense input", () => {
    expect(() => parsePhone("not-a-phone", "ID")).toThrow(
      PhoneNumberParseError,
    );
  });
});

describe("safeParsePhone", () => {
  it("returns success for valid number", () => {
    const result = safeParsePhone("081234567890", "ID");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.number).toBe("+6281234567890");
    }
  });

  it("returns failure for null", () => {
    const result = safeParsePhone(null);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBeDefined();
    }
  });

  it("returns failure for nonsense string", () => {
    const result = safeParsePhone("xyz-abc", "ID");
    expect(result.success).toBe(false);
  });
});
