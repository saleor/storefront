import { NextSeo } from "next-seo";

import { STOREFRONT_NAME } from "@/lib/const";

interface BaseSeoProps {
  title?: string;
  description?: string;
}

export function BaseSeo({ title, description }: BaseSeoProps) {
  const seoTitle = title ? `${title} - ${STOREFRONT_NAME}` : STOREFRONT_NAME;
  const seoDescription = description || "";

  return (
    <NextSeo
      title={seoTitle}
      description={seoDescription}
      openGraph={{
        title: seoTitle,
        description: seoDescription,
        images: [
          {
            url: "https://og-image.vercel.app/React%20Storefront.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fvercel-triangle-black.svg&images=https%3A%2F%2Fsaleor.io%2Fstatic%2Flogo-ad1b99aa7c6f5acf58a61640af760cfd.svg",
            alt: "Hero image",
          },
        ],
        site_name: STOREFRONT_NAME,
      }}
    />
  );
}

export default BaseSeo;
