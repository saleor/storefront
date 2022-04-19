import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";

import { STOREFRONT_NAME } from "@/lib/const";
import { CategoryDetailsFragment } from "@/saleor/api";

interface CategoryPageSeoProps {
  category: CategoryDetailsFragment;
}

export function CategoryPageSeo({ category }: CategoryPageSeoProps) {
  const title = category?.seoTitle ? `${category?.seoTitle} - ${STOREFRONT_NAME}` : STOREFRONT_NAME;
  const seoDescription = category.seoDescription || "";

  let images: OpenGraphMedia[] = [
    {
      url: "https://og-image.vercel.app/React%20Storefront.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fsaleor.io%2Fstatic%2Flogo-ad1b99aa7c6f5acf58a61640af760cfd.svg",
      alt: "Hero image",
    },
  ];
  if (category.backgroundImage) {
    images = [
      {
        url: category.backgroundImage.url,
        alt: category.backgroundImage.alt || "Category lead image",
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

export default CategoryPageSeo;
