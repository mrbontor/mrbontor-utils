import type { PhoneError, PhoneErrorCode } from "./types";

export class PhoneNumberParseError extends Error {
  readonly code: PhoneErrorCode;

  constructor(code: PhoneErrorCode, message: string) {
    super(message);
    this.name = "PhoneNumberParseError";
    this.code = code;
  }

  toJSON(): PhoneError {
    return { code: this.code, message: this.message };
  }
}

/** Convenience factory — keeps call sites short. */
export function createError(
  code: PhoneErrorCode,
  message: string,
): PhoneNumberParseError {
  return new PhoneNumberParseError(code, message);
}
