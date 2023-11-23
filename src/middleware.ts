import { type NextRequest, NextResponse } from "next/server";
import { channels, defaultChannel } from "./lib/constants";

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const pathnameIsMissingChannel = channels.every(
		(channel) => !pathname.startsWith(`/${channel}`) && pathname !== `/${channel}`,
	);

	if (pathnameIsMissingChannel) {
		return NextResponse.redirect(
			new URL(`/${defaultChannel}/${pathname}${request.nextUrl.search}`, request.url),
		);
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
