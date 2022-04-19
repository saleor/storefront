import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";

import { STOREFRONT_NAME } from "@/lib/const";
import { CollectionDetailsFragment } from "@/saleor/api";

interface CollectionPageSeoProps {
  collection: CollectionDetailsFragment;
}

export function CollectionPageSeo({ collection }: CollectionPageSeoProps) {
  const title = collection?.seoTitle
    ? `${collection?.seoTitle} - ${STOREFRONT_NAME}`
    : STOREFRONT_NAME;
  const seoDescription = collection.seoDescription || "";
  let images: OpenGraphMedia[] = [
    {
      url: "https://og-image.vercel.app/React%20Storefront.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fsaleor.io%2Fstatic%2Flogo-ad1b99aa7c6f5acf58a61640af760cfd.svg",
      alt: "Hero image",
    },
  ];
  if (collection.backgroundImage) {
    images = [
      {
        url: collection.backgroundImage.url,
        alt: collection.backgroundImage.alt || "Collection lead image",
      },
      ...images,
    ];
  }
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
