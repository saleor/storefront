import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";

import { STOREFRONT_NAME } from "@/lib/const";
import { CollectionDetailsFragment } from "@/saleor/api";
import { ogImageUrl } from "./utils";

interface CollectionPageSeoProps {
  collection: CollectionDetailsFragment;
}

export function CollectionPageSeo({ collection }: CollectionPageSeoProps) {
  const title = collection?.seoTitle
    ? `${collection?.seoTitle} - ${STOREFRONT_NAME}`
    : STOREFRONT_NAME;
  const seoDescription = collection.seoDescription || "";
  const images: OpenGraphMedia[] = collection.backgroundImage
    ? [
        {
          url: collection.backgroundImage.url,
          alt: collection.backgroundImage.alt || "Collection lead image",
        },
      ]
    : [
        {
          url: ogImageUrl,
          alt: "Collection lead image",
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

export default CollectionPageSeo;
