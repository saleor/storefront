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
	const file = join(root, "src/lib/listing/providers", name, "index.ts");
	if (existsSync(file)) {
		console.error(`${file} already exists`);
		process.exit(1);
	}
	mkdirSync(join(root, "src/lib/listing/providers", name), { recursive: true });
	writeFileSync(
		file,
		`import type { ListingResult } from "@/lib/storefront/contract/listing";
import { listingQueryWithSupportedSort, type ListingProvider } from "@/lib/listing/provider";

export const ${name.replaceAll("-", "")}ListingProvider: ListingProvider = {
	id: "${name}",
	capabilities: {
		surfaces: ["search"],
		facetCounts: true,
		pagination: "offset",
		sorts: { search: ["relevance", "newest", "price_asc", "price_desc"] },
	},
	freshness: { kind: "ttl", profile: "listingTtl" },
	async load(query): Promise<ListingResult | null> {
		query = listingQueryWithSupportedSort(${name.replaceAll("-", "")}ListingProvider, query);
		return {
			items: [],
			facets: [],
			sorts: ["relevance"],
			page: { mode: "offset", number: 1, hasNextPage: false, hasPreviousPage: false },
			total: { value: 0, exact: true },
		};
	},
};
`,
	);
	console.log(`Wrote ${file}`);
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
