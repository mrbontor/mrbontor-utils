import { describe, it, expect } from "vitest";
import {
  formatPhone,
  formatNational,
  formatInternational,
  formatE164,
  formatRFC3966,
  safeFormatPhone,
} from "../src/format";
import { PhoneNumberParseError } from "../src/errors";

describe("formatPhone", () => {
  describe("E.164", () => {
    it("formats E.164 from international number", () => {
      expect(formatPhone("+6281234567890", { format: "E.164" })).toBe(
        "+6281234567890",
      );
    });

    it("formats E.164 from local number with country", () => {
      expect(
        formatPhone("081234567890", { format: "E.164", country: "ID" }),
      ).toBe("+6281234567890");
    });
  });

  describe("INTERNATIONAL", () => {
    it("formats international representation", () => {
      const result = formatPhone("+6281234567890", { format: "INTERNATIONAL" });
      expect(result).toContain("+62");
    });

    it("formats US number internationally", () => {
      const result = formatPhone("+14155552671", { format: "INTERNATIONAL" });
      expect(result).toContain("+1");
    });
  });

  describe("NATIONAL", () => {
    it("formats national representation for ID", () => {
      const result = formatPhone("+6281234567890", {
        format: "NATIONAL",
        country: "ID",
      });
      // Should start with 0 for Indonesian national format
      expect(result).toMatch(/^0/);
    });

    it("formats national representation for US", () => {
      const result = formatPhone("+14155552671", {
        format: "NATIONAL",
        country: "US",
      });
      expect(result).toContain("555");
    });
  });

  describe("RFC3966", () => {
    it("formats RFC3966 URI", () => {
      const result = formatPhone("+6281234567890", { format: "RFC3966" });
      expect(result).toMatch(/^tel:/);
    });
  });

  describe("error handling", () => {
    it("throws for invalid input", () => {
      expect(() =>
        formatPhone("not-a-phone", { format: "E.164", country: "ID" }),
      ).toThrow(PhoneNumberParseError);
    });

    it("throws for empty string", () => {
      expect(() => formatPhone("", { format: "E.164", country: "ID" })).toThrow(
        PhoneNumberParseError,
      );
    });
  });
});

describe("formatNational", () => {
  it("formats Indonesian number in national format", () => {
    const result = formatNational("+6281234567890", "ID");
    expect(result).toMatch(/^0/);
  });
});

describe("formatInternational", () => {
  it("formats with country code", () => {
    const result = formatInternational("+6281234567890");
    expect(result).toContain("+62");
  });
});

describe("formatE164", () => {
  it("returns E.164 from local number", () => {
    expect(formatE164("081234567890", "ID")).toBe("+6281234567890");
  });

  it("returns E.164 from already-international number", () => {
    expect(formatE164("+6281234567890")).toBe("+6281234567890");
  });
});

describe("formatRFC3966", () => {
  it("returns tel: URI", () => {
    expect(formatRFC3966("+6281234567890")).toMatch(/^tel:\+6281234567890/);
  });
});

describe("safeFormatPhone", () => {
  it("returns success for valid number", () => {
    const result = safeFormatPhone("+6281234567890", { format: "E.164" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("+6281234567890");
    }
  });

  it("returns failure for invalid number", () => {
    const result = safeFormatPhone("not-a-phone", {
      format: "E.164",
      country: "ID",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("FORMAT_FAILED");
    }
  });

  it("returns failure for null", () => {
    const result = safeFormatPhone(null, { format: "E.164" });
    expect(result.success).toBe(false);
  });
});
