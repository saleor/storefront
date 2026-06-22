import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { type Metadata } from "next";
import { deleteCartLine } from "@/app/actions";
import { CheckoutLink } from "./checkout-link";
import { DeleteLineButton } from "./delete-line-button";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { getStorefrontContent } from "@/lib/content/server";
import * as Checkout from "@/lib/checkout";
import { formatMoney, getHrefForVariant } from "@/lib/utils";
import { buildBrowsePageMetadata } from "@/lib/seo";
import { resolveLocaleFromSlug } from "@/config/locale";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { buttonClassName } from "@/ui/components/ui/button";

export async function generateMetadata(props: {
	params: Promise<{ locale: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const [{ surfaces }, t] = await Promise.all([
		getStorefrontContent(params.channel, params.locale),
		getTranslations({ locale: params.locale, namespace: "cart.page" }),
	]);

	return buildBrowsePageMetadata({
		title: t("title"),
		description: surfaces.cart.empty.body ?? defaultStorefrontContent.surfaces.cart.empty.body,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: "/cart",
	});
}

export default function Page(props: { params: Promise<{ locale: string; channel: string }> }) {
	return (
		<section className="mx-auto max-w-7xl p-8">
			<Suspense fallback={<CartSkeleton />}>
				<CartContent params={props.params} />
			</Suspense>
		</section>
	);
}

async function CartContent({
	params: paramsPromise,
}: {
	params: Promise<{ locale: string; channel: string }>;
}) {
	const params = await paramsPromise;
	const [{ surfaces }, checkoutId, t] = await Promise.all([
		getStorefrontContent(params.channel, params.locale),
		Checkout.getIdFromCookies(params.channel),
		getTranslations({ locale: params.locale, namespace: "cart.page" }),
	]);
	const cart = surfaces.cart;
	const intlLocale = resolveLocaleFromSlug(params.locale).bcp47;
	const checkout = checkoutId ? await Checkout.find(checkoutId, params.locale) : null;

	if (!checkout || checkout.lines.length < 1) {
		return (
			<div className="mt-12">
				<h1 className="text-balance text-h1 text-foreground">{t("title")}</h1>
				<p className="my-12 text-sm text-muted-foreground">{cart.empty.body}</p>
				<LinkWithChannel href="/products" className={buttonClassName({ className: "max-w-full sm:px-16" })}>
					{cart.empty.ctaLabel}
				</LinkWithChannel>
			</div>
		);
	}

	return (
		<>
			<h1 className="mt-8 text-balance text-h1 text-foreground">{t("title")}</h1>
			<form className="mt-12">
				<ul
					data-testid="CartProductList"
					role="list"
					className="divide-y divide-border border-b border-t border-border"
				>
					{checkout.lines.map((item) => (
						<li key={item.id} className="flex py-4">
							<div className="aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted sm:h-32 sm:w-32">
								{item.variant?.product?.thumbnail?.url && (
									<Image
										src={item.variant.product.thumbnail.url}
										alt={item.variant.product.thumbnail.alt ?? item.variant.product.name}
										width={200}
										height={200}
										className="h-full w-full object-contain object-center"
									/>
								)}
							</div>
							<div className="relative flex flex-1 flex-col justify-between p-4 py-2">
								<div className="flex justify-between justify-items-start gap-4">
									<div>
										<LinkWithChannel
											href={getHrefForVariant({
												productSlug: item.variant.product.slug,
												variantId: item.variant.id,
											})}
										>
											<h2 className="font-medium text-foreground">{item.variant?.product?.name}</h2>
										</LinkWithChannel>
										<p className="mt-1 text-sm text-muted-foreground">
											{item.variant?.product?.category?.name}
										</p>
										{item.variant.name !== item.variant.id && Boolean(item.variant.name) && (
											<p className="mt-1 text-sm text-muted-foreground">
												{t("variant", { name: item.variant.name })}
											</p>
										)}
									</div>
									<p className="text-right font-semibold text-foreground">
										{formatMoney(item.totalPrice.gross.amount, item.totalPrice.gross.currency, intlLocale)}
									</p>
								</div>
								<div className="flex justify-between">
									<div className="text-sm font-bold">{t("quantity", { count: item.quantity })}</div>
									<DeleteLineButton
										deleteLine={deleteCartLine.bind(null, checkoutId, item.id, params.channel)}
									/>
								</div>
							</div>
						</li>
					))}
				</ul>

				<div className="mt-12">
					<div className="rounded-md border bg-muted px-4 py-2">
						<div className="flex items-center justify-between gap-2 py-2">
							<div>
								<p className="font-semibold text-foreground">{t("yourTotal")}</p>
								<p className="mt-1 text-sm text-muted-foreground">{t("shippingNote")}</p>
							</div>
							<div className="font-medium text-foreground">
								{formatMoney(
									checkout.totalPrice.gross.amount,
									checkout.totalPrice.gross.currency,
									intlLocale,
								)}
							</div>
						</div>
					</div>
					<div className="mt-10 text-center">
						<CheckoutLink
							checkoutId={checkoutId}
							disabled={!checkout.lines.length}
							className="w-full sm:w-1/3"
							label={t("checkout")}
							browseLocale={params.locale}
						/>
					</div>
				</div>
			</form>
		</>
	);
}

function CartSkeleton() {
	return (
		<div className="mt-12 animate-pulse">
			<div className="divide-y divide-border border-b border-t border-border">
				{[1, 2].map((i) => (
					<div key={i} className="flex py-4">
						<div className="h-24 w-24 rounded-md bg-muted sm:h-32 sm:w-32" />
						<div className="flex-1 p-4 py-2">
							<div className="h-5 w-48 rounded bg-muted" />
							<div className="mt-2 h-4 w-32 rounded bg-muted" />
						</div>
					</div>
				))}
			</div>
			<div className="mt-12">
				<div className="h-20 rounded-md bg-muted" />
				<div className="mt-10 flex justify-center">
					<div className="h-12 w-48 rounded-md bg-muted" />
				</div>
			</div>
		</div>
	);
}
