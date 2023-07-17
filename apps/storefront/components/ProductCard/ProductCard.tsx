import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { ProductCardFragment } from "@/saleor/api";

export interface ProductCardProps {
  product: ProductCardFragment;
}

export function ProductCard({ product }: ProductCardProps) {
  const paths = usePaths();
  const thumbnailUrl = product.media?.find((media) => media.type === "IMAGE")?.url;

  const price =
    product.pricing && product.pricing.priceRange && product.pricing.priceRange.start
      ? product.pricing.priceRange.start
      : undefined;

  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start;

  const isOnSale = product.pricing?.onSale;

  const salePercentage = (price: any, undiscountedPrice: any) => {
    let salePercentageNumber = 0;
    let discountPercent = 0;
    if (price && undiscountedPrice) {
      salePercentageNumber = (100 * price.net.amount) / undiscountedPrice.net.amount;
      discountPercent = 100 - salePercentageNumber;
      return (
        <p className="absolute top-4 left-4 bg-red-600 px-4 py-2 text-white rounded-md text-md">
          -{Math.round(discountPercent)}%
        </p>
      );
    }
  };

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
              <Image src={thumbnailUrl} width={512} height={512} />
            ) : (
              <div className="grid justify-items-center content-center h-full w-full">
                <PhotographIcon className="h-10 w-10 content-center" />
              </div>
            )}
            {isOnSale
              ? salePercentage(price, undiscountedPrice)
              : product?.collections &&
                product?.collections?.map((collection: any) =>
                  collection.name === "Nowości" ? (
                    <p className="absolute top-4 right-4 bg-green-600 px-4 py-2 text-white rounded-md text-md">
                      Nowość!
                    </p>
                  ) : null
                )}
          </div>
          <p
            className="block mt-2 font-regular text-md text-main first-letter:uppercase lowercase"
            data-testid={`productName${product.name}`}
          >
            {product.name}
          </p>
          <p
            className="block mt-4 text font-semibold text-md text-main uppercase"
            data-testid={`productName${product.name}`}
          >
            {product?.pricing?.priceRange?.start?.net?.amount}
            {product?.pricing?.priceRange?.start?.net?.currency}
          </p>
        </a>
      </Link>
    </li>
  );
}
