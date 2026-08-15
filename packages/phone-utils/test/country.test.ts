import { describe, it, expect } from "vitest";
import { getPhoneCountry, getCountryCallingCode } from "../src/country";

describe("getPhoneCountry", () => {
  it("detects Indonesia from E.164 number", () => {
    expect(getPhoneCountry("+6281234567890")).toBe("ID");
  });

  it("detects US from E.164 number", () => {
    expect(getPhoneCountry("+14155552671")).toBe("US");
  });

  it("detects GB from E.164 number", () => {
    expect(getPhoneCountry("+442079460018")).toBe("GB");
  });

  it("detects Japan from E.164 number", () => {
    expect(getPhoneCountry("+819012345678")).toBe("JP");
  });

  it("detects Singapore from E.164 number", () => {
    expect(getPhoneCountry("+6581234567")).toBe("SG");
  });

  it("detects Malaysia from E.164 number", () => {
    expect(getPhoneCountry("+60123456789")).toBe("MY");
  });

  it("returns undefined for local number without calling code", () => {
    expect(getPhoneCountry("081234567890")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getPhoneCountry("")).toBeUndefined();
  });

  it("returns undefined for non-phone string", () => {
    expect(getPhoneCountry("not-a-phone")).toBeUndefined();
  });

  it("returns undefined for null input", () => {
    expect(getPhoneCountry(null as unknown as string)).toBeUndefined();
  });
});

describe("getCountryCallingCode", () => {
  it("returns 62 for Indonesia", () => {
    expect(getCountryCallingCode("ID")).toBe("62");
  });

  it("returns 1 for United States", () => {
    expect(getCountryCallingCode("US")).toBe("1");
  });

  it("returns 44 for United Kingdom", () => {
    expect(getCountryCallingCode("GB")).toBe("44");
  });

  it("returns 81 for Japan", () => {
    expect(getCountryCallingCode("JP")).toBe("81");
  });

  it("returns 65 for Singapore", () => {
    expect(getCountryCallingCode("SG")).toBe("65");
  });

  it("returns 60 for Malaysia", () => {
    expect(getCountryCallingCode("MY")).toBe("60");
  });

  it("accepts lowercase country code", () => {
    expect(getCountryCallingCode("id")).toBe("62");
  });

  it("returns undefined for unknown country", () => {
    expect(getCountryCallingCode("XX")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getCountryCallingCode("")).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(getCountryCallingCode(null as unknown as string)).toBeUndefined();
  });
});
