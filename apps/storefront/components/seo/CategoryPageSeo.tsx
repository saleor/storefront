import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";

import { STOREFRONT_NAME } from "@/lib/const";
import { CategoryDetailsFragment } from "@/saleor/api";
import { ogImageUrl } from "./utils";

interface CategoryPageSeoProps {
  category: CategoryDetailsFragment;
}

export function CategoryPageSeo({ category }: CategoryPageSeoProps) {
  const title = category?.seoTitle ? `${category?.seoTitle} - ${STOREFRONT_NAME}` : STOREFRONT_NAME;
  const seoDescription = category.seoDescription || "";

  const images: OpenGraphMedia[] = category.backgroundImage
    ? [
        {
          url: category.backgroundImage.url,
          alt: category.backgroundImage.alt || "Category lead image",
        },
      ]
    : [
        {
          url: ogImageUrl,
          alt: "Category lead image",
        },
      ];
  return (
    <NextSeo
      title={title}
      description={seoDescription}
      openGraph={{
        title,
        description: seoDescription,
        images,
        site_name: STOREFRONT_NAME,
      }}
    />
  );
}

export default CategoryPageSeo;
