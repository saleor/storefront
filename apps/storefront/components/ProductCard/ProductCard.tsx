import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { usePaths } from "@/lib/paths";
import {
  CheckoutError,
  ProductDetailsFragment,
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
} from "@/saleor/api";
import { DiscountInfo } from "../DiscountInfo/DiscountInfo";
import { useRegions } from "../RegionsProvider";
import { useWishlist } from "context/WishlistContext";
import Heart from "../Navbar/heart.svg";
import { useIntl } from "react-intl";
import messages from "../translations";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { getSelectedVariantID } from "@/lib/product";
import { useRouter } from "next/router";
import { useUser } from "@/lib/useUser";
import clsx from "clsx";
import { CartSlide } from "../CustomCart/CartSlide";

export interface ProductCardProps {
  product: ProductDetailsFragment;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useIntl();
  const paths = usePaths();
  const router = useRouter();
  const [createCheckout] = useCreateCheckoutMutation();
  const [, setAddToCartError] = useState("");
  const [addProductToCheckout] = useCheckoutAddProductLineMutation();
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false);
  const { checkoutToken, setCheckoutToken, checkout } = useCheckout();
  const { currentChannel, formatPrice, query } = useRegions();
  const [cartSlide, setCartSlide] = useState(false);
  const { user } = useUser();

  const thumbnailUrl = product.media?.find((media) => media.type === "IMAGE")?.url;

  const isOnSale = product.pricing?.onSale;
  const price = product.pricing?.priceRange?.start?.gross;
  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross;

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const isItemInWishlist = (product: any) => {
    return wishlist.some((item) => item.id === product?.id);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddToWishlist = async (product: any) => {
    if (product) {
      addToWishlist(product);
    }
  };

  const handleDeleteFromWishlist = (product: any) => {
    removeFromWishlist(product.id as string);
  };

  const selectedVariantID = getSelectedVariantID(product, router);

  const selectedVariant = product?.variants?.find((v) => v?.id === selectedVariantID) || undefined;

  const onAddToCart = async () => {
    // Clear previous error messages
    setAddToCartError("");

    // Block add to checkout button
    setLoadingAddToCheckout(true);
    const errors: CheckoutError[] = [];

    if (!selectedVariantID) {
      return;
    }

    if (checkout) {
      // If checkout is already existing, add products
      const { data: addToCartData } = await addProductToCheckout({
        variables: {
          checkoutToken,
          variantId: selectedVariantID,
          locale: query.locale,
        },
      });
      addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
        if (e) {
          errors.push(e);
        }
      });
    } else {
      // Theres no checkout, we have to create one
      const { data: createCheckoutData } = await createCheckout({
        variables: {
          email: user?.email,
          channel: currentChannel.slug,
          lines: [
            {
              quantity: 1,
              variantId: selectedVariantID,
            },
          ],
        },
      });
      createCheckoutData?.checkoutCreate?.errors.forEach((e) => {
        if (e) {
          errors.push(e);
        }
      });
      if (createCheckoutData?.checkoutCreate?.checkout?.token) {
        setCheckoutToken(createCheckoutData?.checkoutCreate?.checkout?.token);
      }
    }
    // Enable button
    setLoadingAddToCheckout(false);

    if (errors.length === 0) {
      // Product successfully added
      setCartSlide(true);
      return;
    }

    // Display error message
    const errorMessages = errors.map((e) => e.message || "") || [];
    setAddToCartError(errorMessages.join("\n"));
  };

  const isAddToCartButtonDisabled =
    !selectedVariant || selectedVariant?.quantityAvailable === 0 || loadingAddToCheckout;

  return (
    <li key={product.id} className="w-full bg-gray-100 py-6 px-4 relative">
      <Link
        href={paths.products._slug(product.slug).$url()}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <a href="pass">
          <div className="w-full aspect-1 relative flex justify-center items-center mt-12">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                width={400}
                height={400}
                alt=""
                className="object-contain"
              />
            ) : (
              <div className="grid justify-items-center content-center h-full w-full">
                <PhotographIcon className="h-10 w-10 content-center" />
              </div>
            )}
          </div>
          <p
            className="block mt-6 font-regular text-[17px] md:text-[18px] lg:text-[18px] xl:text-[20px] text-black uppercase text-center"
            data-testid={`productName${product.name}`}
          >
            {product.name}
          </p>
          <div className="flex flex-row gap-3 items-center text-center justify-center">
            <p
              className="block mt-4 text font-semibold text-lg text-main uppercase text-center"
              data-testid={`productName${product.name}`}
            >
              {formatPrice(price)}
            </p>
            {isOnSale && (
              <p className="block mt-4 text font-normal text-lg uppercase line-through text-gray-400 text-center">
                {formatPrice(undiscountedPrice)}
              </p>
            )}
          </div>
        </a>
      </Link>
      <div className="absolute bg-red-600 left-4 top-4 text-white rounded-md text-md">
        <DiscountInfo isOnSale={isOnSale} product={product} />
      </div>
      <div className="absolute right-5 top-5">
        {isItemInWishlist(product) ? (
          <button
            onClick={() => handleDeleteFromWishlist(product)}
            type="submit"
            data-testid="addToWishlistButton"
            className="text-md flex flex-row gap-3"
          >
            <Heart width="28" height="28" fill="red" />
          </button>
        ) : (
          <button
            onClick={() => handleAddToWishlist(product)}
            type="submit"
            data-testid="addToWishlistButton"
            className="text-md flex flex-row gap-3"
          >
            <Heart width="28" height="28" fill="black" />
          </button>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={onAddToCart}
          type="submit"
          disabled={isAddToCartButtonDisabled}
          className={clsx(
            "py-2 text-md px-6 w-max rounded-lg text-white bg-brand border-2 border-brand transition-all ease-in-out duration-300 focus:outline-none",
            {
              "border-gray-300 bg-gray-300 cursor-not-allowed": isAddToCartButtonDisabled,
              "hover:bg-white hover:text-brand hover:border-brand": !isAddToCartButtonDisabled,
            }
          )}
          data-testid="addToCartButton"
        >
          {loadingAddToCheckout
            ? t.formatMessage(messages.adding)
            : t.formatMessage(messages.addToCart)}
        </button>
      </div>

      {cartSlide && <CartSlide isOpen={cartSlide} setIsOpen={setCartSlide} />}
    </li>
  );
}
