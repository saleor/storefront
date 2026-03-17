import { NextResponse, type NextRequest } from "next/server";

/**
 * Captures affiliate referral codes from URL params and stores them in a cookie.
 *
 * When a user visits any page with ?ref=CODE, the code is saved as a 30-day cookie.
 * The checkout flow reads this cookie to auto-apply the affiliate's promo code.
 */
export function middleware(request: NextRequest) {
	const ref = request.nextUrl.searchParams.get("ref");

	if (!ref) {
		return NextResponse.next();
	}

	// Sanitize: only allow alphanumeric, hyphens, underscores (max 50 chars)
	const sanitized = ref.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50);
	if (!sanitized) {
		return NextResponse.next();
	}

	// Strip the ref param from the URL for clean URLs
	const url = request.nextUrl.clone();
	url.searchParams.delete("ref");

	const response = NextResponse.redirect(url);
	response.cookies.set("affiliate_code", sanitized, {
		maxAge: 30 * 24 * 60 * 60, // 30 days
		path: "/",
		sameSite: "lax",
		secure: request.nextUrl.protocol === "https:",
		httpOnly: false, // Needs to be readable by checkout JS
	});

	return response;
}

export const config = {
	// Only run on page routes, skip API/static/internal paths
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
