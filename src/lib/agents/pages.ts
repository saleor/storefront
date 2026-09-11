import "server-only";
import { getProductData, resolvePdpVariants } from "@/lib/catalog/get-product-data";
import { getCategoryData } from "@/lib/catalog/get-category-data";
import { getCollectionData } from "@/lib/catalog/get-collection-data";
import { getPageData } from "@/lib/catalog/get-page-data";
import {
	getCategoryListingPage,
	getCollectionListingPage,
	getProductListingPage,
} from "@/lib/catalog/get-product-listing";
import { catalogPathSuffix } from "@/lib/catalog/canonical-slug";
import { pickTranslatedName } from "@/lib/saleor-translations";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { getBaseUrl } from "@/lib/seo/config";
import { getStorefrontContent } from "@/lib/content/server";
import { OrderDirection, ProductOrderField } from "@/gql/graphql";
import { link, money, richText, text } from "@/lib/agents/markdown";

export async function getAgentPage(locale: string, channel: string, kind?: string, slug?: string) {
	const absolute = (suffix: string) =>
		new URL(buildStorefrontPath(locale, channel, suffix), getBaseUrl()).href;
	const intro = (title: string, suffix: string) =>
		`# ${text(title)}\n\n${link("Canonical page", absolute(suffix))}\n\nLocale: ${text(locale)} · Channel: ${text(channel)}\n\nThis storefront runs on Saleor. ${link("Catalog API and agent instructions", new URL("/agents.md", getBaseUrl()).href)}.\n\nPrices and availability are cached snapshots. Recheck through GraphQL; checkout determines final totals and delivery availability.\n\n`;

	if (kind === "products" && slug) {
		const product = await getProductData(slug, channel, locale);
		if (!product) return null;
		const suffix = catalogPathSuffix("products", product);
		const variantResult = await resolvePdpVariants(product, channel, locale);
		const variants = variantResult.variants.map((variant) => {
			const options = variant.selectionAttributes
				.map(
					(attribute) =>
						`${pickTranslatedName(attribute.attribute)}: ${attribute.values.map((value) => value.translation?.name ?? value.name ?? value.slug ?? "Unknown").join(", ")}`,
				)
				.join("; ");
			return `### ${text(variant.name)}\n\n- Variant ID: ${text(variant.id)}\n- SKU: ${text(variant.sku) || "Not provided"}\n- Options: ${text(options)}\n- Price: ${money(variant.pricing?.price?.gross)}\n- Quantity available: ${variant.quantityAvailable ?? "Unknown"}\n- ${link("View variant", `${absolute(suffix)}?variant=${encodeURIComponent(variant.id)}`)}\n`;
		});
		return {
			suffix,
			body:
				intro(product.name, suffix) +
				`${richText(product.description)}\n\nProduct ID: ${text(product.id)}\n\nPrice from: ${money(product.pricing?.priceRange?.start?.gross)}\n\nProduct available: ${product.isAvailable == null ? "Unknown" : product.isAvailable ? "Yes" : "No"}\n\n` +
				(product.thumbnail ? `${link("Product image", product.thumbnail.url)}\n\n` : "") +
				`## Variants\n\n${variantResult.overBudget ? "This product uses an extended variant catalog or external selection. Query productVariants through GraphQL to browse all variants.\n" : variants.join("\n") || "No variants returned.\n"}`,
		};
	}

	if (kind === "pages" && slug) {
		const page = await getPageData(slug, locale);
		if (!page) return null;
		const suffix = catalogPathSuffix("pages", page);
		return { suffix, body: intro(page.title, suffix) + richText(page.content) + "\n" };
	}

	if (!kind) {
		const content = await getStorefrontContent(channel, locale);
		const { hero, brandStory, featuredCollection } = content.surfaces.homepage;
		return {
			suffix: "",
			body:
				intro(hero.heading, "") +
				`${text(hero.subheading)}\n\n${link(hero.primaryCtaLabel, absolute("/products"))}\n\n` +
				`## ${text(featuredCollection.heading)}\n\n${link("Browse collection", absolute(`/collections/${encodeURIComponent(featuredCollection.collectionSlug)}`))}\n\n` +
				`## ${text(brandStory.heading)}\n\n${brandStory.paragraphs.map(text).join("\n\n")}\n`,
		};
	}

	const entity =
		kind === "categories" && slug
			? await getCategoryData(slug, channel, locale)
			: kind === "collections" && slug
				? await getCollectionData(slug, channel, locale)
				: null;
	if (kind !== "products" && !entity) return null;
	const suffix = entity
		? catalogPathSuffix(kind === "categories" ? "categories" : "collections", entity)
		: "/products";
	const listing =
		kind === "categories" && entity
			? await getCategoryListingPage(entity.slug, channel, locale, undefined)
			: kind === "collections" && entity
				? await getCollectionListingPage(entity.slug, channel, locale, {
						field: ProductOrderField.Collection,
						direction: OrderDirection.Asc,
					})
				: await getProductListingPage(channel, locale, undefined);
	if (!listing) return null;
	const products = listing.edges.map(
		({ node }) =>
			`- ${link(pickTranslatedName(node), absolute(catalogPathSuffix("products", node)))} — from ${money(node.pricing?.priceRange?.start?.gross)}; product ID: ${text(node.id)}`,
	);
	return {
		suffix,
		body:
			intro(entity?.name ?? "Products", suffix) +
			`${richText(entity?.description)}\n\n## Products\n\nCanonical first page; URL filters and cursors are not applied. Use GraphQL for search, filters, and additional pages.\n\n${products.join("\n") || "No products found."}\n\n` +
			`More pages: ${listing.pageInfo.hasNextPage ? "Yes" : "No"}\n\nEnd cursor (use as GraphQL after): ${text(listing.pageInfo.endCursor) || "None"}\n`,
	};
}
