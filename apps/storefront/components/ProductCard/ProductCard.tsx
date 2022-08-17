import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { ProductCardFragment } from "@/saleor/api";

export interface ProductCardProps {
  product: ProductCardFragment;
}

const getCardSecondaryDescription = (product: ProductCardFragment) => {
  const artistAttribute = product.attributes.find(
    (attribute) => attribute.attribute.slug === "artist"
  );
  const mainValue = artistAttribute?.values[0];
  if (mainValue?.name) {
    return mainValue.name;
  }
  if (product.category) {
    return translate(product.category, "name");
  }
  return "";
};

export function ProductCard({ product }: ProductCardProps) {
  const paths = usePaths();
  const secondaryDescription = getCardSecondaryDescription(product);
  const thumbnailUrl = product.media?.find((media) => media.type === "IMAGE")?.url;

  return (
    <li key={product.id} className="w-full first:col-span-2">
      <Link href={paths.products._slug(product.slug).$url()} prefetch={false} passHref>
        <a href="pass" className="flex flex-col w-full">
          <div className="bg-main active:bg-brand w-ful">
            <div className="bg-white w-full h-full relative transition-transform object-contain ">
              {thumbnailUrl ? (
                <Image src={thumbnailUrl} layout="responsive" width="67%" height="100%" />
              ) : (
                <div className="grid justify-items-center content-center h-full w-full">
                  <PhotographIcon className="h-10 w-10 content-center" />
                </div>
              )}
            </div>
          </div>
          <p
            className="block mt-2 text-md font-extrabold text-main truncate"
            data-testid={`productName${product.name}`}
          >
            {translate(product, "name")}
          </p>
          {secondaryDescription && (
            <p className="block text-md font-normal text-main underline">{secondaryDescription}</p>
          )}
        </a>
      </Link>
    </li>
  );
}
