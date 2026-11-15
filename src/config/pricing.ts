/**
 * Price reductions
 *
 * Which price a reduction (strike-through, percentage, sale badge) is measured against.
 *
 * - `"prior-price"`: only Saleor's prior price, the lowest price of the last 30 days that
 *   the merchant keeps in the variant's channel listing (`priorPrice`). No prior price,
 *   no reduction shown. This is what EU/EEA consumer law asks for when a price reduction
 *   is announced (Directive 98/6/EC Art. 6a).
 * - `"list-price"`: the prior price when the merchant set one, otherwise the list price
 *   before promotions.
 *
 * Paper picks the rule per channel from where the channel ships: a channel that ships to
 * at least one of `PRIOR_PRICE_COUNTRIES` uses `"prior-price"`, every other channel
 * `"list-price"`. See `resolvePriceReductionReference` in `src/lib/pricing.ts`.
 */
export type PriceReductionReference = "prior-price" | "list-price";

/**
 * Force a channel's rule, by channel slug. Use it when the shipping countries give the
 * wrong answer for your shop, for example a channel outside the EU that wants the stricter
 * rule (`"prior-price"`), or one that ships to the EU but sells only to businesses
 * (`"list-price"`; that is your call to make with your legal adviser).
 *
 * @example
 * export const priceReductionReferenceByChannel = { uk: "prior-price" };
 */
export const priceReductionReferenceByChannel: Readonly<Record<string, PriceReductionReference>> = {};

/**
 * Countries where an announced price reduction has to name the lowest price of the last
 * 30 days: the 27 EU member states, plus Iceland, Liechtenstein and Norway (EEA).
 */
export const PRIOR_PRICE_COUNTRIES: ReadonlySet<string> = new Set([
	"AT",
	"BE",
	"BG",
	"HR",
	"CY",
	"CZ",
	"DK",
	"EE",
	"FI",
	"FR",
	"DE",
	"GR",
	"HU",
	"IE",
	"IT",
	"LV",
	"LT",
	"LU",
	"MT",
	"NL",
	"PL",
	"PT",
	"RO",
	"SK",
	"SI",
	"ES",
	"SE",
	"IS",
	"LI",
	"NO",
]);
