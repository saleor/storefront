import { NextSeo } from "next-seo";

import { STOREFRONT_NAME } from "@/lib/const";
import { ProductDetailsFragment } from "@/saleor/api";

interface ProductPageSeoProps {
  product: ProductDetailsFragment;
}

export function ProductPageSeo({ product }: ProductPageSeoProps) {
  const productName = product.seoTitle || product.name;
  const title = productName ? `${productName} - ${STOREFRONT_NAME}` : STOREFRONT_NAME;

  const description = product?.seoDescription || "";
  const thumbnailUrl = product.thumbnail?.url || "";
  const thumbnailAlt = product.thumbnail?.alt || title;

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [
          {
            url: thumbnailUrl,
            alt: thumbnailAlt,
          },
        ],
        site_name: "Saleor Tutorial",
      }}
    />
  );
}

export default ProductPageSeo;
