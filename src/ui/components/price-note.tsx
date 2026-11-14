import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getLegalLinks } from "@/lib/catalog/get-legal-links";
import { getPricesIncludeTax } from "@/lib/channels/get-price-display";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { cn } from "@/lib/utils";

type PriceNoteProps = {
	channel: string;
	locale: string;
	/**
	 * `price`: "Incl. VAT, plus shipping costs", under a single price.
	 * `total`: "Incl. VAT", next to a cart total (shipping is stated beside it).
	 * `all`: "All prices incl. VAT, plus shipping costs.", once per page for listings.
	 */
	variant?: "price" | "total" | "all";
	className?: string;
};

/**
 * The notice that a shown price includes VAT and that shipping comes on top. Renders
 * nothing when Saleor says the channel shows prices without tax. "Shipping costs" links to
 * the shop's shipping page when that Saleor Page exists (`src/config/legal.ts`).
 */
export async function PriceNote({ channel, locale, variant = "price", className }: PriceNoteProps) {
	const [pricesIncludeTax, legalLinks, t] = await Promise.all([
		getPricesIncludeTax(channel),
		variant === "total" ? null : getLegalLinks(locale),
		getTranslations({ locale, namespace: "common.prices" }),
	]);

	if (!pricesIncludeTax) {
		return null;
	}

	const shippingPath = legalLinks?.shipping?.path;
	const text =
		variant === "total"
			? t("inclVat")
			: t.rich(variant === "all" ? "allInclVatPlusShipping" : "inclVatPlusShipping", {
					shipping: (chunks) =>
						shippingPath ? (
							<Link
								href={buildStorefrontPath(locale, channel, shippingPath)}
								prefetch={false}
								className="underline underline-offset-2 hover:no-underline"
							>
								{chunks}
							</Link>
						) : (
							chunks
						),
				});

	return <p className={cn("text-xs text-muted-foreground", className)}>{text}</p>;
}
