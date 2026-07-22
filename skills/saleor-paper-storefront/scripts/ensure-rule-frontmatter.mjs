#!/usr/bin/env node
/**
 * Ensure every rules/*.md carries `name` + `description` frontmatter.
 *
 * Why: the frontmatter `description` is the only text an agent host (Cursor,
 * Claude Code, …) keeps in context for skill selection. Without it, the 29
 * rules are an undiscoverable library — the host can only load the whole skill
 * or trust a prose routing table. Sharp per-rule descriptions let the host
 * surface the *one* relevant rule and skip the rest (token-efficient
 * progressive disclosure).
 *
 * Descriptions are authored here (source of truth) and inserted once. The
 * script is idempotent: a file that already has frontmatter is left untouched,
 * so hand-edits in the file win. Keep DESCRIPTIONS in sync when adding a rule
 * (and bump RULE_COUNT in compile-agents.mjs).
 *
 * Usage:
 *   node skills/saleor-paper-storefront/scripts/ensure-rule-frontmatter.mjs        # insert missing
 *   node skills/saleor-paper-storefront/scripts/ensure-rule-frontmatter.mjs --check # CI: fail if any missing
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rulesDir = join(__dirname, "..", "rules");

/**
 * filename → trigger-dense description.
 * Keep these short and keyword-rich ("Use when …" + concrete files/symbols).
 * The host matches the *task* against this text, so name the surfaces and
 * paths an agent would be touching.
 */
const DESCRIPTIONS = {
	"paper-architecture.md":
		"Canonical Next.js 16 App Router stance for Paper: Server Components by default, Server Actions, Cache Components (PPR), BFF auth, two surfaces. Read first when unfamiliar with the codebase or making cross-cutting architectural changes.",
	"data-caching.md":
		"Paper caching decisions: Cache Components (PPR), the sync page → Suspense → cached shell → islands model, cache-manifest.ts as source of truth, webhook revalidation, per-locale cache keys. Use when touching catalog data fetching, ISR, stale content, or revalidation.",
	"data-graphql.md":
		"GraphQL codegen workflow: edit src/graphql/*.graphql or src/checkout/graphql/*.graphql then run pnpm generate / generate:checkout. Use when adding GraphQL fields, hitting missing generated types, permission errors, or the assignedAttribute API.",
	"data-auth-routes.md":
		"BFF auth and PPR-safe account routes: /api/auth/*, HttpOnly cookies, resolveSessionUser, header chrome refresh. Use when touching login/session, account pages, or fixing 'uncached data outside Suspense' on routes that read cookies.",
	"data-storefront-content.md":
		"Provider-agnostic marketing/merchandising copy layer (announcement bar, homepage, cart/checkout copy): getStorefrontContent, defaults.ts, merge semantics, CONTENT_PROVIDER. Use when editing editorial copy or wiring new content fields.",
	"data-storefront-content-saleor.md":
		"Saleor Models (PageTypes + Pages) as the storefront copy surface, slug stack for per-channel copy, Configurator commerce-as-code. Use with CONTENT_PROVIDER=saleor or when adding content PageTypes/attributes.",
	"data-storefront-content-attributes.md":
		"Choosing Saleor attribute inputTypes for storefront content Models (PLAIN_TEXT, BOOLEAN, NUMERIC, references) and what Paper reads today. Use when adding a content attribute or catalog reference to a Model.",
	"product-pdp.md":
		"PDP architecture: ProductShell + dynamic gallery/variant islands, gallery registry/layouts, LCP strategy, add-to-cart Server Action. Use when changing the product detail page layout, gallery, or buy box.",
	"product-variants.md":
		"Variant selection state machine on PDP: selection vs non-selection attributes, control ladder, selection-index, merchant order, URL-driven variant param. Use when changing variant pickers or add-to-cart enablement.",
	"product-high-cardinality.md":
		"High-cardinality catalogs on Paper — PDP_VARIANT_CAP, per-group control ladder, buy-box strategies, ?variant=/?sku= deep links, selection-index, PLP_FACETS alias OR. Use when products have many variants/options, over-cap PDPs, or facet config.",
	"product-filtering.md":
		"PLP filtering/sorting — server-side categories/price/sort plus attribute facets via PLP_FACETS and ProductWhereInput alias OR. Use when changing product list filters, facet config, or sort.",
	"paper-surfaces.md":
		"The two-surface model (storefront vs checkout): route groups, import boundaries, @paper/session-bridge handoff, checkout entry/data flow. Use when working across the storefront/checkout boundary.",
	"checkout-design-principles.md":
		"Evidence-based checkout UX principles (guest-first, mobile thumbs, express pay, fresh totals, trust at pay). Use when making checkout UX, flow, or layout decisions.",
	"checkout-management.md":
		"Checkout session lifecycle: cookie/URL id, RSC + client sync, payment completion/transition UX, shallow ?step= URLs, debugging CHECKOUT_NOT_FULLY_PAID. Use when debugging checkout flow, sessions, or payment completion.",
	"checkout-payment-gateways.md":
		"Adding/changing Saleor payment apps: INTEGRATED_GATEWAYS registry, server- vs client-submit, Stripe + Express Checkout, shared transaction actions. Use when integrating a payment gateway or touching Stripe.",
	"checkout-components.md":
		"Reusable checkout UI: contact, shipping-address, payment/billing components and input-attributes autofill. Use when composing or extending checkout step UI.",
	"ui-design-system.md":
		"The token vocabulary: OKLCH semantic color, typography role tokens, page-width containers, spacing/rhythm, radius/elevation/motion, cva variant matrix. Read before any visual/design work; tokens live in src/styles/brand.css.",
	"design-quality-rubric.md":
		"The world-class design bar: hierarchy, typography, whitespace, restrained palette, Brand Influence Policy, mobile non-negotiables, pre-finish self-check. Use when designing or reviewing storefront UI quality.",
	"ui-sections.md":
		"Catalog of reusable full-bleed marketing sections (HeroBanner, MediaHero, ImageWithText, FeaturedCollectionSection, …) and the section pattern. Use when composing homepage/marketing pages — reuse before building new.",
	"page-composition.md":
		"Molding PDP/homepage by editing page files within the PPR layer model (static shell vs dynamic islands), width and rhythm. Use when adding, reordering, or re-widthing sections without breaking PPR/caching/LCP.",
	"design-from-image.md":
		"Turning a prompt/screenshot/reference into Paper UI by reconfiguring tokens and composing existing sections (not cloning markup). Use when designing from an image or 'make it look like X'.",
	"design-verification.md":
		"Post-design verification gates (autofixer loop): hard gate lint:design-tokens + tsc + lint; advisory PPR/LCP/a11y review. Use after molding UI to confirm it is Paper-correct, fast, and accessible.",
	"ui-components.md":
		"Creating/styling components with design tokens and shadcn/Radix primitives, extending cva matrices, the build-time variant registry. Use when building or restyling a UI component.",
	"ui-channels.md":
		"Channels & multi-currency: URL channel segment, STOREFRONT_CHANNELS allowlist, the purchasability/fulfillment model, channel selector. Use when configuring channels or debugging 'product not purchasable'.",
	"ui-locale-routing.md":
		"Locale + channel URL routing /{locale}/{channel}/…: locale config, allowlisted pairs, per-locale cache keys, region picker, GraphQL languageCode. Use when touching locale/market URLs or i18n routing.",
	"ui-i18n.md":
		"Code-owned functional UI strings via next-intl (messages/{locale}.json): namespaces, ICU plurals, server vs client usage. Use when adding or translating functional UI strings (not merchant-editable copy).",
	"seo-metadata.md":
		"SEO: metadata helpers, product JSON-LD, OG images, hreflang/canonical for locale×channel. Use when adding page metadata, structured data, or social images.",
	"dev-local.md":
		"Local dev gotchas for real-device testing via ngrok/LAN (ALLOWED_DEV_ORIGINS) and Chrome-iOS hydration noise. Use when client components seem broken over a tunnel or on a phone.",
	"dev-investigation.md":
		"Investigating Saleor API behavior via generated types (src/gql/graphql.ts) and Saleor source. Use when unsure about a field, enum, nullability, or storefront auto-filtering behavior.",
	"third-party-embeds.md":
		"Embedding external marketing widgets (reviews/ratings) without breaking Server Components/PPR: next/script in a client leaf, env keys, placement. Use when adding a vendor widget like Yotpo.",
};

const checkOnly = process.argv.includes("--check");

const files = readdirSync(rulesDir)
	.filter((f) => f.endsWith(".md"))
	.sort();

const missingDescription = [];
const withoutFrontmatter = [];
const inserted = [];

for (const file of files) {
	const path = join(rulesDir, file);
	const raw = readFileSync(path, "utf8");

	if (raw.startsWith("---\n")) {
		continue; // already has frontmatter — leave it; hand-edits win
	}

	const description = DESCRIPTIONS[file];
	if (!description) {
		missingDescription.push(file);
		continue;
	}

	withoutFrontmatter.push(file);

	if (!checkOnly) {
		const name = file.replace(/\.md$/, "");
		const frontmatter = `---\nname: ${name}\ndescription: ${description}\n---\n\n`;
		writeFileSync(path, frontmatter + raw);
		inserted.push(file);
	}
}

if (missingDescription.length > 0) {
	console.error(
		`✗ No authored description for: ${missingDescription.join(", ")}\n  Add an entry to DESCRIPTIONS in ${import.meta.url}`,
	);
	process.exit(1);
}

if (checkOnly) {
	if (withoutFrontmatter.length > 0) {
		console.error(`✗ Missing frontmatter in: ${withoutFrontmatter.join(", ")}`);
		process.exit(1);
	}
	console.log(`✓ All ${files.length} rules have frontmatter`);
} else {
	console.log(
		inserted.length > 0
			? `✓ Inserted frontmatter into ${inserted.length} rule(s):\n  ${inserted.join("\n  ")}`
			: `✓ All ${files.length} rules already have frontmatter — nothing to do`,
	);
}
