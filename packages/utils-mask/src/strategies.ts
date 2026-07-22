import type { MaskOptions } from "./types";

export const maskSlice = (str: string, options: MaskOptions = {}): string => {
  if (!str || typeof str !== "string") return str;

  const { maskChar = "*", showStart = 1, showEnd = 1 } = options;
  const len = str.length;

  if (len === 1) {
    return showEnd === 0 ? maskChar : str;
  }

  if (len <= showStart + showEnd) {
    return str[0] + maskChar.repeat(Math.max(0, len - 1));
  }

  const startPart = str.slice(0, showStart);
  const endPart = showEnd > 0 ? str.slice(-showEnd) : "";
  const middlePart = maskChar.repeat(Math.max(0, len - showStart - showEnd));

  return `${startPart}${middlePart}${endPart}`;
};

export const maskEmail = (email: string, options: MaskOptions = {}): string => {
  if (!email || typeof email !== "string" || !email.includes("@")) return email;

  const [localPart, domain] = email.split("@");
  const len = localPart.length;

  const showStart = options.showStart ?? Math.min(2, Math.max(1, len - 1));
  const showEnd = options.showEnd ?? (len > 3 ? 2 : 0);

  const maskedLocal = maskSlice(localPart, {
    maskChar: options.maskChar ?? "*",
    showStart,
    showEnd,
  });

  return `${maskedLocal}@${domain}`;
};

export const maskPhone = (phone: string, options: MaskOptions = {}): string => {
  if (!phone || typeof phone !== "string") return phone;

  const {
    maskChar = "*",
    showStart = 3,
    showEnd = 2,
    preserveFormat = false,
  } = options;

  if (!preserveFormat) {
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const hasPlus = cleanPhone.startsWith("+");
    const digits = cleanPhone.replace("+", "");
    const masked = maskSlice(digits, { maskChar, showStart, showEnd });
    return hasPlus ? `+${masked}` : masked;
  }

  let digitIndex = 0;
  const totalDigits = phone.replace(/\D/g, "").length;

  return phone
    .split("")
    .map((char) => {
      if (/\d/.test(char)) {
        digitIndex++;
        if (digitIndex > showStart && digitIndex <= totalDigits - showEnd) {
          return maskChar;
        }
      }
      return char;
    })
    .join("");
};

export const maskIP = (ip: string, options: MaskOptions = {}): string => {
  if (!ip || typeof ip !== "string") return ip;

  const { maskChar = "*" } = options;

  // IPv6
  if (ip.includes(":")) {
    const segments = ip.split(":");
    return segments
      .map((seg, i) => (i < 2 ? seg : maskChar.repeat(seg.length || 1)))
      .join(":");
  }

  // IPv4 — always keep first two octets, mask the rest
  const octets = ip.split(".");
  if (octets.length !== 4) return ip;

  return octets
    .map((octet, i) => (i < 2 ? octet : maskChar.repeat(octet.length)))
    .join(".");
};

export const maskCard = (card: string, options: MaskOptions = {}): string => {
  if (!card || typeof card !== "string") return card;

  const { maskChar = "*" } = options;

  // Strip spaces/dashes to work on raw digits
  const digits = card.replace(/[\s-]/g, "");
  if (!/^\d{12,19}$/.test(digits)) return card;

  // PCI-DSS standard: show first 6 and last 4
  const showStart = options.showStart ?? 6;
  const showEnd = options.showEnd ?? 4;
  const maskedDigits =
    digits.slice(0, showStart) +
    maskChar.repeat(digits.length - showStart - showEnd) +
    digits.slice(-showEnd);

  // Reformat: first group is showStart digits, last group is showEnd digits, middle is masked
  const firstGroup = maskedDigits.slice(0, showStart);
  const lastGroup = maskedDigits.slice(-showEnd);
  const middleGroup = maskedDigits.slice(showStart, -showEnd);

  return [firstGroup, middleGroup, lastGroup].filter(Boolean).join(" ");
};
