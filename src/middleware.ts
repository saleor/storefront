import { type NextRequest, NextResponse } from "next/server";
import { DefaultChannelSlug } from "@/app/config";
import { getStaticStorefrontChannelSlugs, isAllowedStorefrontChannel } from "@/config/channels";
import { getDefaultLocaleSlug, isLocaleSlug, isStorefrontLocaleSlug } from "@/config/locale";
import { BROWSE_LOCALE_COOKIE, getBrowseLocaleCookieOptions } from "@/lib/browse-locale";
import { buildStorefrontPath } from "@/lib/storefront-path";

const RESERVED_ROOT_SEGMENTS = new Set([
	"api",
	"checkout",
	"_next",
	"favicon.ico",
	"robots.txt",
	"sitemap.xml",
]);

function isChannelSlug(segment: string): boolean {
	const allowed = getStaticStorefrontChannelSlugs();
	return isAllowedStorefrontChannel(segment, allowed);
}

function withBrowseLocaleCookie(request: NextRequest, response: NextResponse, locale: string): NextResponse {
	if (!isStorefrontLocaleSlug(locale)) {
		return response;
	}

	// Skip Set-Cookie when the value is already correct — re-setting on every HTML response
	// marks responses as uncacheable at shared CDNs even when nothing changed.
	const current = request.cookies.get(BROWSE_LOCALE_COOKIE)?.value;
	if (current === locale) {
		return response;
	}

	response.cookies.set(BROWSE_LOCALE_COOKIE, locale, getBrowseLocaleCookieOptions());
	return response;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".") // static files
	) {
		return NextResponse.next();
	}

	const segments = pathname.split("/").filter(Boolean);
	const defaultLocale = getDefaultLocaleSlug();
	const defaultChannel = DefaultChannelSlug ?? getStaticStorefrontChannelSlugs()[0];

	// Root → default browse home
	if (segments.length === 0) {
		if (!defaultChannel) {
			return NextResponse.next();
		}
		const url = request.nextUrl.clone();
		url.pathname = buildStorefrontPath(defaultLocale, defaultChannel);
		return withBrowseLocaleCookie(request, NextResponse.redirect(url, 308), defaultLocale);
	}

	const [first, second, ...rest] = segments;

	if (RESERVED_ROOT_SEGMENTS.has(first)) {
		return NextResponse.next();
	}

	// Disabled locale slug (defined but not in NEXT_PUBLIC_STOREFRONT_LOCALES) → canonical default locale
	if (isLocaleSlug(first) && !isStorefrontLocaleSlug(first)) {
		if (second && isChannelSlug(second)) {
			const url = request.nextUrl.clone();
			const suffix = rest.length > 0 ? `/${rest.join("/")}` : "";
			url.pathname = buildStorefrontPath(defaultLocale, second, suffix);
			return withBrowseLocaleCookie(request, NextResponse.redirect(url, 308), defaultLocale);
		}
		return NextResponse.next();
	}

	// Canonical format: /{locale}/{channel}/…
	if (isStorefrontLocaleSlug(first)) {
		if (second && isChannelSlug(second)) {
			return withBrowseLocaleCookie(request, NextResponse.next(), first);
		}

		// /{locale} only → add default channel
		if (!second && defaultChannel) {
			const url = request.nextUrl.clone();
			url.pathname = buildStorefrontPath(first, defaultChannel);
			return withBrowseLocaleCookie(request, NextResponse.redirect(url, 308), first);
		}

		return NextResponse.next();
	}

	// Legacy: /{channel}/… → /{defaultLocale}/{channel}/…
	if (isChannelSlug(first)) {
		const url = request.nextUrl.clone();
		const suffix = [second, ...rest].filter(Boolean).join("/");
		url.pathname = buildStorefrontPath(defaultLocale, first, suffix ? `/${suffix}` : "");
		return withBrowseLocaleCookie(request, NextResponse.redirect(url, 308), defaultLocale);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image).*)"],
};
