import crypto from "crypto";

const SCRYPT_PREFIX = "scrypt";
const SCRYPT_KEY_LENGTH = 64;

function getTrimmedEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function requireLegacyAdminPassword(): string {
  const password = getTrimmedEnv("ADMIN_PASSWORD");
  if (!password) {
    throw new Error("ADMIN_PASSWORD 또는 대체 secret 환경변수가 설정되지 않았습니다");
  }
  return password;
}

function deriveScopedSecret(scope: string): string {
  return crypto
    .createHmac("sha256", requireLegacyAdminPassword())
    .update(scope)
    .digest("hex");
}

function timingSafeEqualText(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function verifyScryptPassword(candidate: string, serialized: string): boolean {
  const [prefix, salt, expectedHex] = serialized.split(":");
  if (prefix !== SCRYPT_PREFIX || !salt || !expectedHex) {
    throw new Error("ADMIN_PASSWORD_HASH 형식이 올바르지 않습니다");
  }

  const derivedHex = crypto
    .scryptSync(candidate, salt, SCRYPT_KEY_LENGTH)
    .toString("hex");

  return timingSafeEqualText(derivedHex, expectedHex);
}

export function verifyAdminPassword(candidate: string): boolean {
  const passwordHash = getTrimmedEnv("ADMIN_PASSWORD_HASH");
  if (passwordHash) {
    return verifyScryptPassword(candidate, passwordHash);
  }

  const adminPassword = getTrimmedEnv("ADMIN_PASSWORD");
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD 또는 ADMIN_PASSWORD_HASH 환경변수가 설정되지 않았습니다");
  }

  return timingSafeEqualText(candidate, adminPassword);
}

export function getAdminSessionSecret(): string {
  return getTrimmedEnv("ADMIN_SESSION_SECRET") || deriveScopedSecret("admin-session");
}

export function getBookingTokenSecret(): string {
  return getTrimmedEnv("BOOKING_TOKEN_SECRET") || deriveScopedSecret("booking-token");
}

export function getInternalApiToken(): string {
  return getTrimmedEnv("INTERNAL_API_TOKEN") || deriveScopedSecret("internal-api-token");
}
