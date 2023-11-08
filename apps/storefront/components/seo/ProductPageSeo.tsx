import { NextSeo } from "next-seo";

import { STOREFRONT_NAME } from "@/lib/const";
import { ProductDetailsFragment } from "@/saleor/api";
import { ogImageUrl } from "./utils";

interface ProductPageSeoProps {
  product: ProductDetailsFragment;
}

export function ProductPageSeo({ product }: ProductPageSeoProps) {
  const productName = product.seoTitle || product.name;
  const title = productName ? `${productName} - ${STOREFRONT_NAME}` : STOREFRONT_NAME;

  const description = product?.seoDescription || "";
  const thumbnailUrl = product.thumbnail?.url || ogImageUrl;
  const thumbnailAlt = product.thumbnail?.alt || title;

  const images = [
    {
      url: thumbnailUrl,
      alt: thumbnailAlt,
    },
  ];

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images,
        site_name: title,
      }}
    />
  );
}

export default ProductPageSeo;
