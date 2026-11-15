import { Fragment, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { TriangleAlert } from "lucide-react";

import { PRODUCT_SAFETY_FIELDS, type ProductSafetyField } from "@/config/product-safety";
import type { ProductViewSafety } from "@/lib/storefront/contract/product";

const EMAIL = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

/** The text as entered, with any email address turned into a mailto link. */
function withEmailLinks(text: string): ReactNode {
	const parts = text.split(EMAIL);
	return parts.map((part, index) =>
		index % 2 === 1 ? (
			<a key={index} href={`mailto:${part}`} className="underline underline-offset-2 hover:no-underline">
				{part}
			</a>
		) : (
			<Fragment key={index}>{part}</Fragment>
		),
	);
}

/**
 * "Material & safety": the product's material, warnings, manufacturer and EU responsible
 * person, always visible next to the buy box (GPSR Art. 19, Regulation (EU) 1007/2011 Art. 16).
 * Renders nothing when the product has none of them; shows only the rows it has.
 */
export async function ProductSafety({
	safety,
	locale,
}: {
	safety: ProductViewSafety | null | undefined;
	locale: string;
}) {
	if (!safety) {
		return null;
	}

	const t = await getTranslations({ locale, namespace: "pdp.safety" });
	const rows = PRODUCT_SAFETY_FIELDS.flatMap((field) => {
		const value = safety[field];
		return value ? [{ field, value }] : [];
	});

	const label: Record<ProductSafetyField, string> = {
		material: t("material"),
		safetyInformation: t("safetyInformation"),
		manufacturer: t("manufacturer"),
		euResponsiblePerson: t("euResponsiblePerson"),
	};

	return (
		<section aria-labelledby="product-safety-heading" className="space-y-3 border-t border-border pt-6">
			<h2 id="product-safety-heading" className="text-sm font-medium text-foreground">
				{t("heading")}
			</h2>
			<dl className="space-y-3 text-sm">
				{rows.map(({ field, value }) => (
					<div key={field} className="grid gap-0.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
						<dt className="text-muted-foreground">{label[field]}</dt>
						<dd className="min-w-0 break-words text-foreground">
							{field === "safetyInformation" ? (
								<span className="flex items-start gap-1.5 font-medium">
									<TriangleAlert aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
									<span>{value}</span>
								</span>
							) : field === "manufacturer" || field === "euResponsiblePerson" ? (
								withEmailLinks(value)
							) : (
								value
							)}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
