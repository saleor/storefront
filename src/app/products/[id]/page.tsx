import { CheckoutAddLineDocument, ProductElementDocument, ProductListDocument } from "@/gql/graphql";
import { execute } from "@/lib";
import { Image } from "@/ui/atoms/Image";
import edjsHTML from "editorjs-html";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AddButton } from "./AddButton";
import { VariantSelector } from "@/ui/components/VariantSelector";
import { CheckIcon } from "lucide-react";
import * as Checkout from "@/lib/checkout";

export const metadata = {
	title: "Product Details · Saleor Storefront",
};

export async function generateStaticParams() {
	const { products } = await execute(ProductListDocument);

	const paths = products?.edges.map(({ node: { id } }) => ({ id })) || [];
	return paths;
}

const parser = edjsHTML();

export default async function Page(props: { params: { id: string }; searchParams: { variant: string } }) {
	const { params, searchParams } = props;
	console.log("variant", searchParams.variant);

	const { product } = await execute(ProductElementDocument, {
		variables: {
			id: decodeURIComponent(params.id),
		},
		revalidate: 1,
	});

	if (!product) {
		notFound();
	}

	const firstImage = product?.thumbnail;
	const description = parser.parse(JSON.parse((product?.description as string) || "{}"));

	const variants = product?.variants || [];
	const selectedVariantID = searchParams.variant || variants[0].id;

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

		if (checkoutId) {
			const checkout = await Checkout.find(checkoutId);

			if (!checkout) {
				cookies().delete("checkoutId");
			}

			// TODO: error handling
			const _r = await execute(CheckoutAddLineDocument, {
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
			<form className="grid grid-cols-2 gap-4" action={addItem}>
				{firstImage && <Image alt={"image"} src={firstImage?.url} />}
				<div className="flex flex-col justify-between px-6">
					<div>
						<h1 className="flex-auto text-3xl font-bold tracking-tight text-slate-900">{product?.name}</h1>

						<VariantSelector variants={variants} />
						<div className="mt-4 space-y-6">
							<div dangerouslySetInnerHTML={{ __html: description }}></div>
						</div>
						<div className="mt-6 flex items-center">
							<CheckIcon className="h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden="true" />
							<p className="ml-1 text-sm font-semibold text-slate-500">In stock</p>
						</div>
					</div>

					<div className="mt-8">
						<AddButton />
					</div>
				</div>
			</form>
		</section>
	);
}
