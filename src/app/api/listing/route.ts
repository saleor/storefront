import { NextRequest } from "next/server";
import { isStorefrontLocaleSlug } from "@/config/locale";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { loadListing } from "@/lib/catalog/fetch-filtered-listing";
import { listingViewFromSearchParams, type ListingSurface } from "@/lib/catalog/listing-query";

const SURFACES = new Set<ListingSurface>(["all", "category", "collection"]);

function parseSurface(value: string | null): ListingSurface | null {
	if (value && SURFACES.has(value as ListingSurface)) return value as ListingSurface;
	return null;
}

/**
 * Filtered / sorted / paginated listing JSON.
 *
 * Canonical (empty-query) HTML is rendered by the listing pages and must not
 * await `searchParams`. This route is the hole for every other view.
 */
export async function GET(request: NextRequest) {
	const url = request.nextUrl;
	const surface = parseSurface(url.searchParams.get("surface"));
	const locale = url.searchParams.get("locale") ?? "";
	const channel = url.searchParams.get("channel") ?? "";
	const slug = url.searchParams.get("slug") ?? undefined;

	if (!surface) {
		return Response.json({ error: "Invalid surface" }, { status: 400 });
	}
	if (!isStorefrontLocaleSlug(locale)) {
		return Response.json({ error: "Invalid locale" }, { status: 400 });
	}

	const channels = await getStorefrontChannelSlugs();
	if (!channels.includes(channel)) {
		return Response.json({ error: "Invalid channel" }, { status: 400 });
	}
	if (surface !== "all" && !slug) {
		return Response.json({ error: "Missing slug" }, { status: 400 });
	}

	const payload = await loadListing({
		surface,
		locale,
		channel,
		slug,
		view: listingViewFromSearchParams(url.searchParams),
	});

	if (!payload) {
		return Response.json({ error: "Not found" }, { status: 404 });
	}

	return Response.json(payload, {
		headers: { "Cache-Control": "private, no-store" },
	});
}
