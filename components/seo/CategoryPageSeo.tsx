import { NextSeo } from "next-seo";
import { OpenGraphMedia } from "next-seo/lib/types";

import { CategoryDetailsFragment } from "@/saleor/api";

interface CategoryPageSeoProps {
  category: CategoryDetailsFragment;
}

export const CategoryPageSeo = ({ category }: CategoryPageSeoProps) => {
  const baseTitle = `Saleor Tutorial`;
  const baseDescription =
    "Saleor tutorial project. Learn how to use our API and create storefront for your shop";

  const seoTitle = !category.seoTitle
    ? baseTitle
    : `${category.seoTitle} - ${baseTitle}`;
  const seoDescription = category.seoDescription || baseDescription;
  let images: OpenGraphMedia[] = [
    {
      url: "https://og-image.vercel.app/React%20Storefront.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fsaleor.io%2Fstatic%2Flogo-ad1b99aa7c6f5acf58a61640af760cfd.svg",
      alt: "Saleor tutorial hero image",
    },
  ];
  if (!!category.backgroundImage) {
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
      title={seoTitle}
      description={seoDescription}
      openGraph={{
        title: seoTitle,
        description: seoDescription,
        images,
        site_name: "Saleor Tutorial",
      }}
    />
  );
};

export default CategoryPageSeo;
