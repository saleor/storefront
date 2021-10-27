import { NextSeo } from "next-seo";
import { ProductDetailsFragment } from "@/saleor/api";

interface ProductPageSeoProps {
  product: ProductDetailsFragment;
}

export const ProductPageSeo = ({ product }: ProductPageSeoProps) => {
  const title = `${product?.seoTitle} - Saleor Tutorial`;
  const description =
    product?.seoDescription || "Welcome to tutorial storefront.";
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
};

export default ProductPageSeo;
