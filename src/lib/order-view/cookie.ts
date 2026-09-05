import "server-only";
import { cookies } from "next/headers";

import { ORDER_VIEW_COOKIE_MAX_AGE_SECONDS, ORDER_VIEW_COOKIE_NAME } from "./constants";
import { verifyOrderViewToken } from "./token";

function shouldUseHttps(): boolean {
	return (
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") === true ||
		Boolean(process.env.NEXT_PUBLIC_VERCEL_URL)
	);
}

export async function setOrderViewCookie(token: string): Promise<void> {
	(await cookies()).set(ORDER_VIEW_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: "lax",
		secure: shouldUseHttps(),
		path: "/",
		maxAge: ORDER_VIEW_COOKIE_MAX_AGE_SECONDS,
	});
}

export async function readOrderViewCookie(): Promise<string | null> {
	try {
		return (await cookies()).get(ORDER_VIEW_COOKIE_NAME)?.value ?? null;
	} catch {
		return null;
	}
}

export async function readVerifiedOrderIdFromCookie(): Promise<string | null> {
	const token = await readOrderViewCookie();
	if (!token) {
		return null;
	}
	return verifyOrderViewToken(token)?.orderId ?? null;
}
