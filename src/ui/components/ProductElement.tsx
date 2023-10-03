import Link from "next/link";
import { Image } from "@/ui/atoms/Image";

import type { ProductFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/graphql";

export function ProductElement(props: { product: ProductFragment }) {
	const { product } = props;

	return (
		<Link href={`/products/${product.slug}`} key={product.id}>
			<div>
				<Image src={product?.thumbnail?.url || ""} alt="image" width={200} height={200} />
				<div className="mt-2 flex justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">{product.name}</h3>
						<p className="text-sm text-gray-500">{product?.category?.name}</p>
					</div>
					<p className="text-sm font-medium text-gray-900">
						{formatMoneyRange({
							start: product?.pricing?.priceRange?.start?.gross,
							stop: product?.pricing?.priceRange?.stop?.gross,
						})}
					</p>
				</div>
			</div>
		</Link>
	);
}
