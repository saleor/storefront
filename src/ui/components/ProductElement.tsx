import Link from "next/link";
import { USDollarFormatter } from "@/lib";
import { Image } from "@/ui/atoms/Image";

import type { ProductFragment } from "@/gql/graphql";

export function ProductElement(props: { product: ProductFragment }) {
	const { product } = props;

	return (
		<Link href={`/products/${product.id}`} key={product.id}>
			<div>
				<Image src={product?.thumbnail?.url || ""} alt="image" width={200} height={200} />
				<div className="mt-2 flex justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">{product.name}</h3>
						<p className="text-sm text-gray-500">{product?.category?.name}</p>
					</div>
					<p className="text-sm font-medium text-gray-900">
						{USDollarFormatter.format(product?.pricing?.priceRange?.start?.gross.amount || 0)}
					</p>
				</div>
			</div>
		</Link>
	);
}
