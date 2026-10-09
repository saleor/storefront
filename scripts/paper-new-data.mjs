#!/usr/bin/env node
/**
 * pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>
 * pnpm paper:new template pdp <kebab-name>
 *
 * Scaffolds a file and prints the registration step. It does not edit the
 * operation registry or the template registry, so the contract tests stay the checklist.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const [command, ...rest] = process.argv.slice(2);

if (command === "template") {
	const [surface, name] = rest;
	if ((surface !== "pdp" && surface !== "plp") || !name || !/^[a-z][a-z0-9-]*$/.test(name)) {
		console.error("Usage: pnpm paper:new template <pdp|plp> <kebab-name>");
		process.exit(1);
	}
	if (surface === "plp") {
		const file = join(root, "src/templates/plp", `${name}.tsx`);
		if (existsSync(file)) {
			console.error(`${file} already exists`);
			process.exit(1);
		}
		const component = name
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join("");
		writeFileSync(
			file,
			`import { ProductsGridSkeleton } from "@/ui/components/plp/products-grid-skeleton";
import { definePlpTemplate } from "@/lib/storefront/templates";
import { PlpPresetLayout } from "@/templates/plp/preset-layout";

function ${component}Skeleton() {
	return <ProductsGridSkeleton />;
}

export const ${name.replaceAll("-", "")}Plp = definePlpTemplate({
	id: "${name}",
	facets: "bar",
	Layout: PlpPresetLayout,
	Skeleton: ${component}Skeleton,
});
`,
		);
		console.log(`Wrote ${file}`);
		console.log(`Next: register it in src/templates/plp/registry.ts.`);
		console.log(`Then set ACTIVE_PLP_TEMPLATE and ACTIVE_PLP_FACETS in src/config/template-selection.ts.`);
		process.exit(0);
	}
	const file = join(root, "src/templates/pdp", `${name}.tsx`);
	if (existsSync(file)) {
		console.error(`${file} already exists`);
		process.exit(1);
	}
	const component = name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
	writeFileSync(
		file,
		`import { definePdpTemplate, type PdpTemplateProps } from "@/lib/storefront/templates";
import { ProductRouteSkeleton } from "@/ui/components/pdp/product-route-skeleton";

function ${component}Layout({ product, slots }: PdpTemplateProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<div className="container-content flex-1 py-4 sm:py-6 lg:py-10">
				<div className="mb-6 hidden sm:block">{slots.breadcrumbs}</div>
				<h1 className="text-balance text-h1">{product.name}</h1>
				{slots.gallery}
				{slots.buyBox}
				{slots.attributes}
			</div>
		</div>
	);
}

export const ${component.charAt(0).toLowerCase()}${component.slice(1)}Pdp = definePdpTemplate({
	id: "${name}",
	gallery: "standard",
	Layout: ${component}Layout,
	Skeleton: ProductRouteSkeleton,
});
`,
	);
	console.log(`Wrote ${file}`);
	console.log(`Next: register it in src/templates/pdp/registry.ts.`);
	console.log(`Then set ACTIVE_PDP_TEMPLATE and ACTIVE_PDP_GALLERY in src/config/template-selection.ts.`);
	process.exit(0);
}

if (command === "provider") {
	const [kind, name] = rest;
	if (kind !== "listing" || !name || !/^[a-z][a-z0-9-]*$/.test(name)) {
		console.error("Usage: pnpm paper:new provider listing <id>");
		process.exit(1);
	}
	const dir = join(root, "src/lib/listing/providers", name);
	const file = join(dir, "index.ts");
	const testFile = join(dir, "contract.test.ts");
	if (existsSync(file) || existsSync(testFile)) {
		console.error(`${dir} already has a provider`);
		process.exit(1);
	}
	const camel = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
	const pascal = camel[0].toUpperCase() + camel.slice(1);
	mkdirSync(dir, { recursive: true });
	writeFileSync(
		file,
		`import type { ListingProvider } from "@/lib/listing/provider";
import type { ListingQuery, ListingResult, ProductCardView } from "@/lib/storefront/contract/listing";

/** One engine response. Replace with the engine's shape and map it in \`load\`. */
export type ${pascal}Hits = {
	items: ProductCardView[];
	total: number;
	/** Facet id → value → count, as the engine aggregates them. */
	facets: Record<string, Record<string, number>>;
} | null;

/** One request to the engine. Production uses the engine client; the contract test passes a stub. */
export type ${pascal}Transport = (query: ListingQuery) => Promise<${pascal}Hits>;

async function engineTransport(_query: ListingQuery): Promise<${pascal}Hits> {
	throw new Error('Listing provider "${name}": call the engine in engineTransport.');
}

export function create${pascal}ListingProvider(transport: ${pascal}Transport = engineTransport): ListingProvider {
	const provider: ListingProvider = {
		id: "${name}",
		capabilities: {
			surfaces: ["search"],
			facetCounts: true,
			pagination: "offset",
			sorts: { search: ["relevance", "newest", "price_asc", "price_desc"] },
		},
		freshness: { kind: "ttl", profile: "listingTtl" },
		// Core already fit the sort and page to the capabilities above (normalizeListingQuery).
		async load(query): Promise<ListingResult | null> {
			const hits = await transport(query);
			if (!hits) return null;
			const number = query.page.mode === "offset" ? query.page.number : 1;
			return {
				items: hits.items,
				facets: Object.entries(hits.facets).map(([id, values]) => ({
					id,
					labelKey: id,
					control: "chip" as const,
					values: Object.entries(values).map(([value, count]) => ({
						value,
						label: value,
						count,
						selected: query.selections[id]?.includes(value) ?? false,
					})),
				})),
				sorts: [...(provider.capabilities.sorts[query.surface.kind] ?? [])],
				page: {
					mode: "offset",
					number,
					hasNextPage: number * query.pageSize < hits.total,
					hasPreviousPage: number > 1,
				},
				total: { value: hits.total, exact: true },
			};
		},
	};
	return provider;
}

export const ${camel}ListingProvider = create${pascal}ListingProvider();
`,
	);
	writeFileSync(
		testFile,
		`import { describe } from "vitest";
import { runListingProviderContract } from "@/lib/listing/testing";
import type { ProductCardView } from "@/lib/storefront/contract/listing";
import { create${pascal}ListingProvider } from "./index";

const CATALOG: ProductCardView[] = Array.from({ length: 15 }, (_, index) => ({
	id: \`p-\${index}\`,
	name: \`Product \${index}\`,
	slug: \`product-\${index}\`,
	price: 10 + index,
	currency: "USD",
	image: "",
	href: \`/products/product-\${index}\`,
}));

/** Stub engine: \`boom\` fails, everything else pages through CATALOG. Replace with recorded responses. */
const provider = create${pascal}ListingProvider(async (query) => {
	if (query.channel === "boom") throw new Error("engine down");
	const number = query.page.mode === "offset" ? query.page.number : 1;
	const start = (number - 1) * query.pageSize;
	return {
		items: CATALOG.slice(start, start + query.pageSize),
		total: CATALOG.length,
		facets: { colors: { blue: 4, black: 2 } },
	};
});

describe("${name} listing provider", () => {
	runListingProviderContract(provider, {
		query: {
			surface: { kind: "search", text: "tee" },
			channel: "default-channel",
			locale: "en",
			selections: {},
			page: { mode: "offset", number: 1 },
			pageSize: 12,
		},
	});
});
`,
	);
	console.log(`Wrote ${file}`);
	console.log(`Wrote ${testFile}`);
	console.log(`Next: add it to LISTING_PROVIDER_REGISTRY in src/config/listing-providers.ts.`);
	console.log(`Point a surface at "${name}" (search stays live; do not edit src/lib/listing/policy.ts).`);
	process.exit(0);
}

if (command !== "data") {
	console.error("Usage: pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>");
	console.error("       pnpm paper:new template <pdp|plp> <kebab-name>");
	console.error("       pnpm paper:new provider listing <id>");
	process.exit(1);
}

const [kind, name] = rest;
const kinds = new Set(["cached-entity", "live-query", "mutation"]);
if (!kinds.has(kind) || !name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
	console.error("Usage: pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>");
	process.exit(1);
}

const operation = kind === "mutation" ? "mutation" : "query";
const file = join(root, "src/graphql", `${name}.graphql`);
if (existsSync(file)) {
	console.error(`${file} already exists`);
	process.exit(1);
}

const body =
	kind === "mutation"
		? `${operation} ${name}($id: ID!) {\n\t# fill in\n}\n`
		: `${operation} ${name}($slug: String!, $channel: String!, $languageCode: LanguageCodeEnum!) {\n\t# fill in\n}\n`;

writeFileSync(file, body);
const access = kind === "mutation" ? "mutate" : kind === "live-query" ? "live" : "cached";
console.log(`Wrote ${file}`);
console.log(
	`Next: register ${name} as access "${access}" in src/lib/saleor/operations.ts (or src/config/data-extensions.ts).`,
);
console.log("Then call it from a loader or server action and run pnpm generate && pnpm data:lock.");
