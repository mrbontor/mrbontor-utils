import { describe, it, expect } from "vitest";
import {
  maskSlice,
  maskEmail,
  maskPhone,
  maskIP,
  maskCard,
} from "../src/strategies";

describe("maskSlice", () => {
  it("should mask the middle characters of a string", () => {
    expect(maskSlice("hello", { showStart: 1, showEnd: 1 })).toBe("h***o");
  });

  it("should use custom mask character", () => {
    expect(
      maskSlice("hello", { maskChar: "#", showStart: 1, showEnd: 1 }),
    ).toBe("h###o");
  });

  it("should return string unchanged if too short to mask", () => {
    expect(maskSlice("ab", { showStart: 1, showEnd: 1 })).toBe("a*");
  });

  it("should handle empty string", () => {
    expect(maskSlice("")).toBe("");
  });
});

describe("maskEmail", () => {
  it("should mask the local part of an email", () => {
    const result = maskEmail("user@example.com");
    expect(result).toContain("@example.com");
    expect(result).not.toBe("user@example.com");
  });

  it("should return original if not a valid email", () => {
    expect(maskEmail("notanemail")).toBe("notanemail");
  });

  it("should keep enough characters visible", () => {
    const result = maskEmail("johndoe@example.com");
    expect(result.startsWith("jo")).toBe(true);
    expect(result).toContain("@example.com");
  });
});

describe("maskPhone", () => {
  it("should mask the middle of a phone number", () => {
    const result = maskPhone("+6281234567890");
    expect(result.startsWith("+")).toBe(true);
    expect(result).toContain("*");
  });

  it("should preserve format when option is set", () => {
    const result = maskPhone("+62 812-3456-7890", {
      preserveFormat: true,
      showStart: 2,
      showEnd: 2,
    });
    expect(result).toContain("-");
    expect(result).toContain(" ");
  });

  it("should handle plain numeric phone", () => {
    const result = maskPhone("081234567890");
    expect(result).not.toBe("081234567890");
    expect(result).toContain("*");
  });
});

describe("maskIP", () => {
  it("should mask last two octets of IPv4", () => {
    expect(maskIP("192.168.1.100")).toBe("192.168.*.***");
  });

  it("should keep first two octets visible", () => {
    const result = maskIP("10.0.0.1");
    expect(result.startsWith("10.0.")).toBe(true);
    expect(result).toContain("*");
  });

  it("should mask IPv6 segments after the first two", () => {
    const result = maskIP("2001:db8:85a3:0000:0000:8a2e:0370:7334");
    expect(result.startsWith("2001:db8:")).toBe(true);
    expect(result).toContain("*");
  });

  it("should return original if not a valid IP", () => {
    expect(maskIP("not-an-ip")).toBe("not-an-ip");
  });

  it("should support custom mask character", () => {
    expect(maskIP("192.168.1.1", { maskChar: "x" })).toBe("192.168.x.x");
  });
});

describe("maskCard", () => {
  it("should mask middle digits of a card number (PCI-DSS style)", () => {
    const result = maskCard("4111111111111111");
    expect(result).toBe("411111 ****** 1111");
  });

  it("should handle card numbers with spaces", () => {
    const result = maskCard("4111 1111 1111 1111");
    expect(result).toBe("411111 ****** 1111");
  });

  it("should handle card numbers with dashes", () => {
    const result = maskCard("4111-1111-1111-1111");
    expect(result).toBe("411111 ****** 1111");
  });

  it("should return original if not a valid card number", () => {
    expect(maskCard("not-a-card")).toBe("not-a-card");
    expect(maskCard("123")).toBe("123");
  });

  it("should support custom showStart and showEnd", () => {
    const result = maskCard("4111111111111111", { showStart: 4, showEnd: 4 });
    expect(result).toBe("4111 ******** 1111");
  });

  it("should support custom mask character", () => {
    const result = maskCard("4111111111111111", { maskChar: "#" });
    expect(result).toBe("411111 ###### 1111");
  });
});
