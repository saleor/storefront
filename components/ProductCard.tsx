import { ProductCardFragment } from "@/saleor/api";
import Link from "next/link";
import React from "react";

const styles = {
  grid: `grid grid-cols-4 gap-4`,
  product: {
    name: `block text-lg text-gray-900 truncate`,
    category: `block text-sm font-medium text-gray-500`,
    price: `block text-xs font-medium text-gray-900`,
    details: `px-4 py-2 border-gray-100 bg-gray-50 border-t`,
  },
};

export interface ProductCardProps {
  product: ProductCardFragment;
}

export const ProductCard: React.VFC<ProductCardProps> = ({ product }) => {
  let priceDisplay =
    product.pricing?.priceRange?.start?.gross.localizedAmount || "";
  if (
    product.pricing?.priceRange?.start?.gross.amount !==
    product.pricing?.priceRange?.stop?.gross.amount
  ) {
    priceDisplay = "from " + priceDisplay;
  }
  const imageStyle: React.CSSProperties = {};
  if (!!product.thumbnail?.url) {
    imageStyle.backgroundImage = `url(${product.thumbnail?.url})`;
    imageStyle.backgroundSize = "auto";
    imageStyle.backgroundRepeat = "no-repeat";
    imageStyle.backgroundPosition = "center";
  }
  return (
    <li
      key={product.id}
      className="relative bg-white border shadow-md hover:shadow-2xl"
    >
      <Link href={`/products/${product.slug}`} prefetch={false}>
        <a>
          <div
            className="flex rounded flex-col  w-full h-60 bg-gray-200"
            style={imageStyle}
          >
            {!!product.pricing?.onSale && (
              <>
                <br />
                <div className="bg-red-600 text-white w-1/4 text-center rounded-r-xl shadow-lg">
                  Sale
                </div>
              </>
            )}
          </div>
          <div className={styles.product.details}>
            <p className={styles.product.name}>{product.name}</p>
            <p className={styles.product.category}>{product.category?.name}</p>
            <p className={styles.product.price}>{priceDisplay}</p>
          </div>
        </a>
      </Link>
    </li>
  );
};
