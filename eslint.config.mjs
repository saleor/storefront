import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import nextEnv from "@next/env";
import nextVitals from "eslint-config-next/core-web-vitals";

// `@next/env` is CJS — no named ESM export.
nextEnv.loadEnvConfig(process.cwd());

/**
 * Schema for `@graphql-eslint` — the same remote schema codegen reads (see `.graphqlrc.ts`).
 * Required: without it the deprecation rule would silently pass. Set it in `.env.local`
 * (CI sets it in `.github/workflows/lint.yml`).
 */
const saleorSchemaUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

if (!saleorSchemaUrl) {
	throw new Error(
		"NEXT_PUBLIC_SALEOR_API_URL is required to lint GraphQL documents. Set it in .env.local.",
	);
}

const graphqlConfigBlock = {
	files: ["src/**/*.graphql"],
	languageOptions: {
		parser: graphqlPlugin.parser,
		parserOptions: {
			graphQLConfig: {
				schema: saleorSchemaUrl,
				documents: "src/**/*.graphql",
			},
		},
	},
	plugins: { "@graphql-eslint": graphqlPlugin },
	rules: {
		// Warn only: deprecated fields still work, but every hit is a migration to schedule
		// before Saleor removes it. Run `pnpm lint` to see the current list.
		"@graphql-eslint/no-deprecated": "warn",
	},
};

/**
 * Files allowed to import `next/image`.
 *
 * Every `next/image` render of a remote file is a billed Vercel transformation +
 * image-cache write. Catalog imagery must go through `SaleorImage` (plain
 * `<img srcset>` against Saleor's CDN — see the `ui-images` rule); `next/image`
 * is reserved for local assets and CMS uploads without thumbnail rungs. This list
 * freezes today's usages so a new import is a deliberate, reviewed exception —
 * not a silent cost regression.
 */
const NEXT_IMAGE_ALLOWED_FILES = [
	"src/ui/atoms/saleor-image.tsx",
	"src/ui/atoms/product-image-wrapper.tsx",
	"src/ui/components/order-list-item.tsx",
	"src/ui/components/plp/category-hero.tsx",
	"src/ui/components/plp/product-card-base.tsx",
	"src/ui/components/nav/components/user-menu/components/user-avatar.tsx",
	"src/ui/components/account/account-nav.tsx",
	"src/ui/components/account/order-row.tsx",
	"src/ui/components/cart/cart-drawer.tsx",
	"src/ui/sections/hero-banner/hero-banner.tsx",
	"src/ui/sections/logo-strip/logo-strip.tsx",
	"src/ui/sections/media-hero/media-hero.tsx",
	"src/ui/sections/multicolumn-section/multicolumn-section.tsx",
	"src/checkout/views/saleor-checkout/order-summary.tsx",
	// Brackets are minimatch character classes — escape literal route segments.
	"src/app/(storefront)/\\[locale\\]/\\[channel\\]/(main)/cart/page.tsx",
	"src/app/(storefront)/\\[locale\\]/\\[channel\\]/(main)/account/orders/\\[number\\]/page.tsx",
];

/**
 * Files allowed to set `prefetch={true}` / `prefetch="true"`.
 *
 * Full prefetch resolves the destination (including `searchParams`) on every view
 * of the linking page — a listing render the shopper never asked for. Empty by
 * default; adding a file is a deliberate, reviewed cost exception.
 */
const PREFETCH_TRUE_ALLOWED_FILES = [];

const PREFETCH_TRUE_MESSAGE =
	"prefetch={true} full-resolves the destination (including searchParams) on every " +
	"view of the linking page. Use default (auto) under partialPrefetching, or " +
	"prefetch={false} for footer/utility links. If this file genuinely needs full " +
	"prefetch, add it to PREFETCH_TRUE_ALLOWED_FILES in eslint.config.mjs.";

const config = [
	...nextVitals,
	{
		ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		ignores: NEXT_IMAGE_ALLOWED_FILES,
		rules: {
			"no-restricted-imports": [
				"error",
				{
					paths: [
						{
							name: "next/image",
							message:
								"next/image bills a Vercel transformation per remote render. Use SaleorImage " +
								"(Saleor CDN srcset — see the ui-images rule) for catalog imagery. If this file " +
								"genuinely needs next/image (local asset, CMS upload without rungs), add it to " +
								"NEXT_IMAGE_ALLOWED_FILES in eslint.config.mjs.",
						},
					],
				},
			],
		},
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		ignores: PREFETCH_TRUE_ALLOWED_FILES,
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector: "JSXAttribute[name.name='prefetch'][value.expression.value=true]",
					message: PREFETCH_TRUE_MESSAGE,
				},
				{
					selector: "JSXAttribute[name.name='prefetch'][value.value='true']",
					message: PREFETCH_TRUE_MESSAGE,
				},
			],
		},
	},
	graphqlConfigBlock,
];

export default config;
