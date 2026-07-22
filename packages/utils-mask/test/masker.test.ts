import { describe, it, expect } from "vitest";
import { DataMasker } from "../src/masker";

describe("DataMasker", () => {
  it("should mask a field by key name", () => {
    const data = { email: "user@example.com", name: "John" };
    const result = DataMasker.mask(data, [
      { match: "email", strategy: "email" },
    ]);
    expect(result.email).not.toBe("user@example.com");
    expect(result.name).toBe("John");
  });

  it("should mask a field using regex matcher", () => {
    const data = { phoneNumber: "+6281234567890" };
    const result = DataMasker.mask(data, [
      { match: /phone/i, strategy: "phone" },
    ]);
    expect(result.phoneNumber).not.toBe("+6281234567890");
    expect(result.phoneNumber).toContain("*");
  });

  it("should mask a field using function matcher", () => {
    const data = { secretKey: "supersecret123" };
    const result = DataMasker.mask(data, [
      { match: (key) => key.startsWith("secret"), strategy: "slice" },
    ]);
    expect(result.secretKey).not.toBe("supersecret123");
  });

  it("should handle nested objects", () => {
    const data = { user: { email: "test@test.com", age: 25 } };
    const result = DataMasker.mask(data, [
      { match: "email", strategy: "email" },
    ]);
    expect(result.user.email).not.toBe("test@test.com");
    expect(result.user.age).toBe(25);
  });

  it("should handle arrays of objects", () => {
    const data = [{ email: "a@a.com" }, { email: "b@b.com" }];
    const result = DataMasker.mask(data, [
      { match: "email", strategy: "email" },
    ]);
    expect(result[0].email).not.toBe("a@a.com");
    expect(result[1].email).not.toBe("b@b.com");
  });

  it("should return primitive data unchanged", () => {
    expect(DataMasker.mask("hello" as any, [])).toBe("hello");
    expect(DataMasker.mask(123 as any, [])).toBe(123);
    expect(DataMasker.mask(null as any, [])).toBe(null);
  });

  it("should support custom inline strategy function", () => {
    const data = { token: "abc123xyz" };
    const result = DataMasker.mask(data, [
      { match: "token", strategy: () => "REDACTED" },
    ]);
    expect(result.token).toBe("REDACTED");
  });

  it("should support registered custom strategies", () => {
    DataMasker.registerStrategy("upper", (val) => val.toUpperCase());
    const data = { code: "mysecret" };
    const result = DataMasker.mask(data, [
      { match: "code", strategy: "upper" },
    ]);
    expect(result.code).toBe("MYSECRET");
  });
});
