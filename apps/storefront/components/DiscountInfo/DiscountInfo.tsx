import { ProductCardFragment } from "@/saleor/api";
import React from "react";
import { TaxedMoney } from "../TaxedMoney";

interface DiscountInfoProps {
  product: ProductCardFragment;
  isOnSale: boolean | undefined | null;
}

export const DiscountInfo = ({ isOnSale, product }: DiscountInfoProps) => {
  const price = product?.pricing?.priceRange?.start;

  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start;

  const salePercentage = (price: any, undiscountedPrice: any) => {
    let salePercentageNumber = 0;
    let discountPercent = 0;
    if (price && undiscountedPrice) {
      salePercentageNumber = (100 * price.net.amount) / undiscountedPrice.net.amount;
      discountPercent = 100 - salePercentageNumber;
      return (
        <p className="bg-red-600 px-4 py-2 text-white rounded-md text-md">
          -{Math.round(discountPercent)}%
        </p>
      );
    }
  };

  const checkCollection = () => {
    return product?.collections?.map((collection: any) =>
      collection.name === "Nowości" ? (
        <div className="bg-green-500 px-4 py-2 text-white rounded-md text-md">
          <p>Nowość!</p>
        </div>
      ) : null
    );
  };

  return (
    <div>
      {isOnSale ? (
        <div className="bg-red-500 text-white rounded-md text-md">
          {salePercentage(price, undiscountedPrice)}
        </div>
      ) : (
        checkCollection()
      )}
    </div>
  );
};
