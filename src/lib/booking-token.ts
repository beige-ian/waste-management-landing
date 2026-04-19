import crypto from "crypto";
import { getBookingTokenSecret } from "@/lib/server-secrets";

/** Generate a booking access token from phone number */
export function generateBookingToken(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return crypto
    .createHmac("sha256", getBookingTokenSecret())
    .update(digits)
    .digest("hex")
    .slice(0, 32);
}

/** Validate booking token from request */
export function validateBookingToken(
  req: {
    headers: { get(name: string): string | null };
    nextUrl: { searchParams: { get(name: string): string | null } };
  },
  phone: string,
): boolean {
  const token =
    req.headers.get("x-booking-token") ||
    req.nextUrl.searchParams.get("token");
  if (!token) return false;
  const expected = generateBookingToken(phone);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
