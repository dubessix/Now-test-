export function cleanPhone(value: string) {
  return value.replace(/\D/g, "").slice(-10);
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isPhone(value: string) {
  return /^[6-9]\d{9}$/.test(cleanPhone(value));
}

export function isUtr(value: string) {
  return /^[A-Za-z0-9]{8,22}$/.test(value.trim());
}

export function isName(value: string) {
  const t = value.trim();
  return t.length >= 2 && t.length <= 80;
}
