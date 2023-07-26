import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";

import { usePaths } from "@/lib/paths";
import { ProductCardFragment } from "@/saleor/api";
import { DiscountInfo } from "../DiscountInfo/DiscountInfo";
import { useRegions } from "../RegionsProvider";

export interface ProductCardProps {
  product: ProductCardFragment;
}

export function ProductCard({ product }: ProductCardProps) {
  const paths = usePaths();
  const { formatPrice } = useRegions();

  const thumbnailUrl = product.media?.find((media) => media.type === "IMAGE")?.url;

  const isOnSale = product.pricing?.onSale;
  const price = product.pricing?.priceRange?.start?.gross;
  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross;

  return (
    <li key={product.id} className="w-full">
      <Link
        href={paths.products._slug(product.slug).$url()}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <a href="pass">
          <div className="w-full aspect-1 relative">
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} width={512} height={512} alt="" />
            ) : (
              <div className="grid justify-items-center content-center h-full w-full">
                <PhotographIcon className="h-10 w-10 content-center" />
              </div>
            )}
            <div className="absolute bg-red-600 left-4 top-4 text-white rounded-md text-md">
              <DiscountInfo isOnSale={isOnSale} product={product} />
            </div>
          </div>
          <p
            className="block mt-2 font-regular text-md text-main first-letter:uppercase lowercase"
            data-testid={`productName${product.name}`}
          >
            {product.name}
          </p>
          <div className="flex flex-row gap-3 items-center">
            <p
              className="block mt-4 text font-semibold text-md text-main uppercase"
              data-testid={`productName${product.name}`}
            >
              {formatPrice(price)}
            </p>
            {isOnSale && (
              <p className="block mt-4 text font-normal text-md uppercase line-through text-gray-400">
                {formatPrice(undiscountedPrice)}
              </p>
            )}
          </div>
        </a>
      </Link>
    </li>
  );
}
