import type { ShopSellerIdentityQuery } from "@/gql/graphql";

/**
 * Who sells in this shop, as a storefront shows it on the imprint and in the footer.
 *
 * Saleor has no seller entity yet. The address and phone come from the shop's company
 * address (Dashboard → Settings → Store → Company Information); the rest comes from
 * public shop metadata under `seller.*`:
 *
 * | Key                      | Example                                    |
 * | ------------------------ | ------------------------------------------ |
 * | `seller.legalName`       | `Northvale Outfitters GmbH`                |
 * | `seller.representatives` | `Anna Example (Geschäftsführerin)`         |
 * | `seller.register`        | `Amtsgericht Charlottenburg, HRB 000000 B` |
 * | `seller.vatId`           | `DE000000000`                              |
 * | `seller.email`           | `hello@example.com`                        |
 *
 * Every field is optional: a shop fills in what its jurisdiction asks for.
 */
export type SellerIdentity = {
	/** `seller.legalName`, else the company address's company name. */
	legalName: string;
	address: SellerAddress | null;
	phone: string | null;
	email: string | null;
	representatives: string | null;
	register: string | null;
	vatId: string | null;
};

export type SellerAddress = {
	streetLines: string[];
	postalCode: string | null;
	city: string | null;
	countryCode: string | null;
};

type Shop = ShopSellerIdentityQuery["shop"];

const clean = (value: string | null | undefined): string | null => value?.trim() || null;

/** `null` when the shop names no seller: nothing to put on an imprint. */
export function toSellerIdentity(shop: Shop): SellerIdentity | null {
	const company = shop.companyAddress;
	const legalName = clean(shop.sellerLegalName) ?? clean(company?.companyName);
	if (!legalName) {
		return null;
	}

	const streetLines = [clean(company?.streetAddress1), clean(company?.streetAddress2)].filter(
		(line): line is string => line !== null,
	);
	const postalCode = clean(company?.postalCode);
	const city = clean(company?.city);
	const hasAddress = streetLines.length > 0 || postalCode !== null || city !== null;

	return {
		legalName,
		address: hasAddress ? { streetLines, postalCode, city, countryCode: clean(company?.country.code) } : null,
		phone: clean(company?.phone),
		email: clean(shop.sellerEmail),
		representatives: clean(shop.sellerRepresentatives),
		register: clean(shop.sellerRegister),
		vatId: clean(shop.sellerVatId),
	};
}

/** Country name in the shopper's language, e.g. `DE` → "Deutschland" for `de-DE`. */
export function sellerCountryName(countryCode: string | null, bcp47: string): string | null {
	if (!countryCode) {
		return null;
	}

	try {
		return new Intl.DisplayNames([bcp47], { type: "region" }).of(countryCode) ?? countryCode;
	} catch {
		return countryCode;
	}
}

/** Address lines as printed on the imprint: street, "postal code city", country. */
export function sellerAddressLines(address: SellerAddress, bcp47: string): string[] {
	const locality = [address.postalCode, address.city].filter(Boolean).join(" ");
	const country = sellerCountryName(address.countryCode, bcp47);
	return [...address.streetLines, locality, country].filter((line): line is string => Boolean(line));
}
