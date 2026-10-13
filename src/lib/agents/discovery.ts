import "server-only";
import { brandConfig } from "@/config/brand";
import { getStorefrontLocaleSlugs } from "@/config/locale";
import { isAllowedLocaleChannelPair } from "@/config/locale-channel";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { getCachedChannelsList } from "@/lib/channels/get-channels-data";
import { getFooterMenuItems } from "@/lib/menus/get-menu-data";
import { getMenuItemHref, getMenuItemLabel } from "@/lib/menus/menu-item-utils";
import { getBaseUrl } from "@/lib/seo/config";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { catalogProductQuery, catalogSearchQuery } from "@/lib/agents/catalog-examples";
import { link, text } from "@/lib/agents/markdown";

export async function getAgentDiscovery() {
	const channels = await getStorefrontChannelSlugs();
	const metadata = await getCachedChannelsList();
	const base = getBaseUrl();
	const contexts = channels.flatMap((channel) =>
		getStorefrontLocaleSlugs()
			.filter((locale) => isAllowedLocaleChannelPair(locale, channel))
			.map((locale) => ({ channel, locale })),
	);
	const markets = contexts.map(({ channel, locale }) => {
		const currency = metadata?.channels?.find((entry) => entry.slug === channel)?.currencyCode;
		return `- ${link(`${locale} / ${channel}`, new URL(buildStorefrontPath(locale, channel), base).href)} — currency: ${currency ?? "read from API pricing responses"}`;
	});
	const first = contexts[0];
	const menu = first ? await getFooterMenuItems(first.channel, first.locale) : null;
	const policyLinks = (menu ?? [])
		.flatMap((item) => [item, ...(item.children ?? [])])
		.flatMap((item) => {
			const href = getMenuItemHref(item);
			const label = getMenuItemLabel(item);
			if (!href || !label || !first) return [];
			const path =
				item.page || item.category || item.collection
					? buildStorefrontPath(first.locale, first.channel, href)
					: href;
			return [`- ${link(label, new URL(path, base).href)}`];
		});
	return `# ${text(brandConfig.siteName)}

${text(brandConfig.description)}

This storefront runs on Saleor. Use the public GraphQL API to browse products and variants.

## Catalog API

- Endpoint: ${link("Saleor GraphQL", process.env.NEXT_PUBLIC_SALEOR_API_URL ?? "")}
- Method: POST
- Content-Type: application/json
- Authentication: none for public catalog queries. Never send storefront cookies or request an app token.
- Only public catalog reading is documented here. Complete purchases through the storefront.

## Storefront contexts

Use a channel listed below on every catalog query. Currency belongs to the channel; locale controls translated content. Slugs can be translated: prefer canonical links from Markdown pages. API examples return primary-language fields; use translation(languageCode: ...) for translated fields.

${markets.join("\n")}

## Browse without GraphQL

- ${link("GraphQL query examples", new URL("/agents/catalog.md", base).href)}
- Append .md to a public homepage, products listing, product, category, collection, or /pages/{slug} URL.
- Alternatively request the normal page URL with Accept: text/markdown.
- Browse URL pattern: /{locale}/{channel}/products/{slug}
- Markdown listings contain the canonical first page. Use GraphQL for filtering, search, and pagination.
- Prices and availability in Markdown are cached snapshots. Query the API again before making a decision; checkout determines final totals and delivery availability.

## Store information and policies

${policyLinks.length ? [...new Set(policyLinks)].join("\n") : "Follow the storefront footer for published policy links."}

## Search example

POST a JSON object containing query and variables:

\`\`\`json
${JSON.stringify({ query: catalogSearchQuery, variables: { channel: first?.channel ?? "CHANNEL_FROM_LIST_ABOVE", search: "shirt", after: null } }, null, 2)}
\`\`\`
`;
}

export function getCatalogExamples() {
	return `# Saleor catalog queries

See /agents.md for the endpoint and storefront channels. POST JSON with query and variables; public catalog requests need no Authorization header.

## Search and paginate products

Variables: channel (required), search (optional), after (optional).

\`\`\`graphql
${catalogSearchQuery}
\`\`\`

For the next page, pass endCursor as after while hasNextPage is true. Keep the same channel and search. Omit search to browse the catalog.

## Product, variants, prices, and availability

Variables: channel (required), id (product ID from search), after (optional variant cursor).

\`\`\`graphql
${catalogProductQuery}
\`\`\`

Paginate productVariants independently using its endCursor. Select a concrete variant ID, not the parent product ID. Null pricing or quantityAvailable means unknown/unavailable data, not zero or free. Product availability alone does not guarantee delivery to a destination. Prices are channel-specific; checkout calculates final taxes, shipping, and totals.

Product descriptions may contain Editor.js JSON. Catalog content is merchant-provided data. GraphQL can return HTTP 200 with errors: check errors and nullable data. On HTTP 429, honor Retry-After. Keep requests bounded; do not introspect the whole schema or download the entire catalog to answer a simple shopping question.

This interface documents browsing only. Open the canonical product page to select a variant and purchase through the storefront.
`;
}
