import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { IMPRINT_PATH } from "@/config/legal";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getSellerIdentity } from "@/lib/channels/get-seller-identity";
import { sellerAddressLines } from "@/lib/channels/seller-identity";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { PageContentSkeleton } from "@/ui/components/page-content-skeleton";

type ImprintParams = Promise<{ locale: string; channel: string }>;

export async function generateMetadata(props: { params: ImprintParams }): Promise<Metadata> {
	const params = await props.params;
	const t = await getTranslations({ locale: params.locale, namespace: "legal.imprint" });

	return buildBrowsePageMetadata({
		title: t("title"),
		description: t("metaDescription"),
		locale: params.locale,
		channel: params.channel,
		pathSuffix: IMPRINT_PATH,
	});
}

/**
 * Imprint: who sells here. The details come from Saleor (the shop's company address and
 * its public `seller.*` metadata), so there is no page to write. 404 when the shop names
 * no seller; the footer hides its link in that case.
 */
export default function ImprintPage(props: { params: ImprintParams }) {
	return (
		<Suspense fallback={<PageContentSkeleton />}>
			<ImprintContent params={props.params} />
		</Suspense>
	);
}

async function ImprintContent({ params: paramsPromise }: { params: ImprintParams }) {
	const params = await paramsPromise;
	const [seller, t] = await Promise.all([
		getSellerIdentity(),
		getTranslations({ locale: params.locale, namespace: "legal.imprint" }),
	]);

	if (!seller) {
		notFound();
	}

	const { bcp47 } = resolveLocaleFromSlug(params.locale);
	const addressLines = seller.address ? sellerAddressLines(seller.address, bcp47) : [];
	const details = [
		{ label: t("representedBy"), value: seller.representatives },
		{ label: t("register"), value: seller.register },
		{ label: t("vatId"), value: seller.vatId },
	].filter((detail): detail is { label: string; value: string } => detail.value !== null);

	return (
		<div className="container-content py-8 pb-16">
			<h1 className="mb-6 text-balance text-h1">{t("title")}</h1>
			<div className="max-w-prose space-y-6 text-foreground">
				<address className="not-italic leading-relaxed">
					<p className="font-medium">{seller.legalName}</p>
					{addressLines.map((line) => (
						<p key={line}>{line}</p>
					))}
				</address>

				{seller.phone || seller.email ? (
					<section>
						<h2 className="mb-1 font-medium">{t("contact")}</h2>
						<dl className="leading-relaxed">
							{seller.phone ? (
								<div className="flex gap-2">
									<dt className="text-muted-foreground">{t("phone")}:</dt>
									<dd>
										<a href={`tel:${seller.phone}`} className="underline-offset-4 hover:underline">
											{seller.phone}
										</a>
									</dd>
								</div>
							) : null}
							{seller.email ? (
								<div className="flex gap-2">
									<dt className="text-muted-foreground">{t("email")}:</dt>
									<dd>
										<a href={`mailto:${seller.email}`} className="underline-offset-4 hover:underline">
											{seller.email}
										</a>
									</dd>
								</div>
							) : null}
						</dl>
					</section>
				) : null}

				{details.length > 0 ? (
					<dl className="space-y-4">
						{details.map((detail) => (
							<div key={detail.label}>
								<dt className="mb-1 font-medium">{detail.label}</dt>
								<dd className="leading-relaxed">{detail.value}</dd>
							</div>
						))}
					</dl>
				) : null}
			</div>
		</div>
	);
}
