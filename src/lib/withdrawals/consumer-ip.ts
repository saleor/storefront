import "server-only";

import { headers } from "next/headers";

import { getClientIpFromHeaders } from "@/lib/auth/auth-rate-limit";

/**
 * The consumer's IP for a withdrawal backend's rate limits: the first `x-forwarded-for` entry, else
 * `x-real-ip`, else "unknown" (local development, some hosts). A missing IP never blocks a
 * withdrawal; a backend should rate-limit "unknown" more strictly instead.
 */
export async function getConsumerIp(): Promise<string> {
	return getClientIpFromHeaders(await headers());
}
