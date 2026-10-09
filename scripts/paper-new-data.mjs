#!/usr/bin/env node
/**
 * pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>
 * pnpm paper:new template pdp <kebab-name>
 *
 * Scaffolds a file and prints the registration step. It does not edit the
 * operation registry or the template registry, so the contract tests stay the checklist.
 */
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const [command, ...rest] = process.argv.slice(2);

if (command === "template") {
	const [surface, name] = rest;
	if (surface !== "pdp" || !name || !/^[a-z][a-z0-9-]*$/.test(name)) {
		console.error("Usage: pnpm paper:new template pdp <kebab-name>");
		process.exit(1);
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

if (command !== "data") {
	console.error("Usage: pnpm paper:new data <cached-entity|live-query|mutation> <PascalName>");
	console.error("       pnpm paper:new template pdp <kebab-name>");
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
