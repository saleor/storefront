import { NextResponse ,type  NextRequest } from "next/server";


export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	// Enable back/forward cache by avoiding cache-control: no-store
	// For product pages and listings, use cache with revalidation
	const pathname = request.nextUrl.pathname;

	if (
		pathname.includes("/products") ||
		pathname.includes("/categories") ||
		pathname.includes("/collections")
	) {
		// Allow caching with revalidation for better bfcache support
		response.headers.set(
			"Cache-Control",
			"public, max-age=0, must-revalidate, stale-while-revalidate=59",
		);
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder files
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|ttf|woff|woff2)$).*)",
	],
};
