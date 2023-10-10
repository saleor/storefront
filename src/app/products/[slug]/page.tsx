import edjsHTML from "editorjs-html";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { CheckIcon } from "lucide-react";
import { type Metadata } from "next";
import { AddButton } from "./AddButton";
import { VariantSelector } from "@/ui/components/VariantSelector";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { execute, formatMoney } from "@/lib/graphql";
import { CheckoutAddLineDocument, ProductElementDocument, ProductListDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { variant?: string };
}): Promise<Metadata> {
	const { product } = await execute(ProductElementDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
		},
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;

	const title = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${title} · Saleor Storefront example`,
		description: product.seoDescription || title,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
	};
}

export async function generateStaticParams() {
	const { products } = await execute(ProductListDocument);

	const paths = products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	return paths;
}

const parser = edjsHTML();

export default async function Page(props: { params: { slug: string }; searchParams: { variant?: string } }) {
	const { params, searchParams } = props;

	const { product } = await execute(ProductElementDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
		},
		revalidate: 1,
	});

	if (!product) {
		notFound();
	}

	const firstImage = product.thumbnail;
	const description = parser.parse(JSON.parse((product?.description as string) || "{}"));

	const variants = product.variants;
	const selectedVariantID = searchParams.variant;
	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID);

	async function addItem() {
		"use server";

		let checkoutId = cookies().get("checkoutId")?.value;

		if (!checkoutId) {
			const { checkoutCreate } = await Checkout.create();

			if (checkoutCreate && checkoutCreate?.checkout?.id) {
				cookies().set("checkoutId", checkoutCreate.checkout?.id);

				checkoutId = checkoutCreate.checkout.id;
			}
		}

		checkoutId = cookies().get("checkoutId")?.value;

		if (checkoutId && selectedVariantID) {
			const checkout = await Checkout.find(checkoutId);

			if (!checkout) {
				cookies().delete("checkoutId");
			}

			// TODO: error handling
			await execute(CheckoutAddLineDocument, {
				variables: {
					id: checkoutId,
					productVariantId: decodeURIComponent(selectedVariantID),
				},
			});

			revalidatePath("/cart");
		} else {
			throw new Error("Cart not found");
		}
	}

	return (
		<section className="mx-auto grid max-w-7xl p-8">
			<form className="grid gap-2 sm:grid-cols-2" action={addItem}>
				{firstImage && (
					<ProductImageWrapper alt={firstImage.alt ?? ""} width={1024} height={1024} src={firstImage.url} />
				)}
				<div className="flex flex-col pt-6 sm:px-6 sm:pt-0">
					<div>
						<h1 className="flex-auto text-3xl font-bold tracking-tight text-slate-900 mb-4">{product?.name}</h1>
						<p className="text-sm font-medium text-gray-900 mb-8">
							{selectedVariant?.pricing?.price?.gross
								? formatMoney(
										selectedVariant.pricing.price.gross.amount,
										selectedVariant.pricing.price.gross.currency,
								  )
								: "select variant to see the price"}
						</p>

						{variants && <VariantSelector variants={variants} />}
						<div className="mt-4 space-y-6 mt-8">
							<div dangerouslySetInnerHTML={{ __html: description }}></div>
						</div>
						<div className="mt-6 flex items-center">
							<CheckIcon className="h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden="true" />
							<p className="ml-1 text-sm font-semibold text-slate-500">In stock</p>
						</div>
					</div>

					<div className="mt-8">
						<AddButton disabled={!selectedVariantID} />
					</div>
				</div>
			</form>
		</section>
	);
}
