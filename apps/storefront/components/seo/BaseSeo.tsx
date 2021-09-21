import { NextSeo } from "next-seo";

interface BaseSeoProps {
  title?: string;
  description?: string;
}

export const BaseSeo: React.VFC<BaseSeoProps> = ({ title, description }) => {
  const baseTitle = `Saleor Tutorial`;
  const baseDescription =
    "Saleor tutorial project. Learn how to use our API and create storefront for your shop";

  const seoTitle = title || baseTitle;
  const seoDescription = description || baseDescription;

  return (
    <NextSeo
      title={seoTitle}
      description={seoDescription}
      openGraph={{
        title: seoTitle,
        description: seoDescription,
        images: [
          {
            url: "/saleor.svg",
            alt: "Saleor logo",
          },
        ],
        site_name: "Saleor Tutorial",
      }}
    />
  );
};

export default BaseSeo;
