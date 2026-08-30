import nextVitals from "eslint-config-next/core-web-vitals";

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
	"src/ui/components/ui/image-carousel.tsx",
	"src/ui/sections/hero-banner/hero-banner.tsx",
	"src/ui/sections/logo-strip/logo-strip.tsx",
	"src/ui/sections/media-hero/media-hero.tsx",
	"src/ui/sections/multicolumn-section/multicolumn-section.tsx",
	"src/checkout/views/saleor-checkout/order-summary.tsx",
	// Brackets are minimatch character classes — escape literal route segments.
	"src/app/(storefront)/\\[locale\\]/\\[channel\\]/(main)/cart/page.tsx",
	"src/app/(storefront)/\\[locale\\]/\\[channel\\]/(main)/account/orders/\\[number\\]/page.tsx",
];

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
];

export default config;
