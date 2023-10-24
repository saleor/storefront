import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { usePaths } from "@/lib/paths";
import {
  AttributeFilterFragment,
  CheckoutError,
  ProductCardFragment,
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
} from "@/saleor/api";
import { DiscountInfo } from "../DiscountInfo/DiscountInfo";
import { useRegions } from "../RegionsProvider";
import { useWishlist } from "context/WishlistContext";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { getSelectedVariantID } from "@/lib/product";
import { useRouter } from "next/router";
import { useUser } from "@/lib/useUser";
import clsx from "clsx";
import { CartSlide } from "../CustomCart/CartSlide";
import NavIconButton from "../Navbar/NavIconButton";
import Tooltip from "@mui/material/Tooltip";

export interface ProductCardProps {
  product: ProductCardFragment;
}

export function ProductCard({ product }: ProductCardProps) {
  // const t = useIntl();
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
  const [sizeAttribute, setSizeAttribute] = useState<any>(null);
  const [brandAttribute, setBrandAttribute] = useState<any>(null);

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

  const getBrandAttributeFromProduct = (product: ProductCardFragment) => {
    if (!product || !product.attributes) {
      return null;
    }
    const brandAttribute = product.attributes.find(
      (attribute) =>
        attribute.attribute &&
        attribute.attribute.slug &&
        attribute.attribute.slug.includes("marka")
    );

    return brandAttribute ? brandAttribute.values : null;
  };

  const getSizeAttributeFromProduct = (product: ProductCardFragment) => {
    if (!product || !product.attributes) {
      return null;
    }

    const sizeAttribute = product.attributes.find(
      (attribute) => attribute.attribute && attribute.attribute.slug === "rozmiar"
    );

    return sizeAttribute ? sizeAttribute.values : null;
  };
  useEffect(() => {
    const sizeAttr = getSizeAttributeFromProduct(product);
    setSizeAttribute(sizeAttr);
    const brandAttr = getBrandAttributeFromProduct(product);
    setBrandAttribute(brandAttr);
  }, [product]);

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
    setAddToCartError("");

    setLoadingAddToCheckout(true);
    const errors: CheckoutError[] = [];

    if (!selectedVariantID) {
      return;
    }

    if (checkout) {
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
    <li
      key={product.id}
      className="w-full pb-6 px-4 relative bg-gray-100 hover:bg-[#D4FFC8] cursor-pointer overflow-hidden flex flex-col justify-between h-[100%]"
    >
      <Link
        href={paths.products._slug(product.slug).$url()}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <div>
          <a className="block">
            <div className="w-full relative flex justify-start items-center mt-16 h-[300px]">
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
            <div className="flex flex-row justify-between items-center">
              <p className="block mt-6 font-regular text-[18px] text-black">
                {brandAttribute
                  ? brandAttribute.map((value: AttributeFilterFragment) => value.name).join(", ")
                  : "-"}
              </p>
              <p className="block mt-6 font-regular text-[17px] text-black">
                {sizeAttribute
                  ? sizeAttribute.map((value: AttributeFilterFragment) => value.name).join(", ")
                  : "-"}
              </p>
            </div>
            <p className="block mt-6 text-[16px] text-black uppercase font-semibold">
              {product.name}
            </p>
            <div className="flex flex-row gap-3 items-center">
              <p className="mt-4 font-semibold text-[19px] text-black uppercase">
                {formatPrice(price)}
              </p>
              {isOnSale && (
                <p className="mt-4 font-normal text-[19px] uppercase line-through text-gray-400">
                  {formatPrice(undiscountedPrice)}
                </p>
              )}
            </div>
            {/* TODO: Adding the lowest price from 30 days ago */}
            {/* <p className="block mt-6 font-regular text-[13px] md:text-[13px] lg:text-[13px] xl:text-[13px] text-black">
              Najniższa cena w ciągu ostatnich 30 dni: 279,87 zł
            </p> */}
          </a>
        </div>
      </Link>
      <div className="absolute bg-red-600 left-4 top-4 text-white rounded-md text-md">
        <DiscountInfo isOnSale={isOnSale} product={product} />
      </div>
      <div className="absolute right-3 top-5 flex flex-col gap-3 items-center">
        <button
          onClick={onAddToCart}
          type="submit"
          disabled={isAddToCartButtonDisabled}
          className={clsx("text-md", {
            "filter brightness-0 invert-[60%] cursor-not-allowed": isAddToCartButtonDisabled,
            "": !isAddToCartButtonDisabled,
          })}
        >
          {isAddToCartButtonDisabled ? (
            <Tooltip
              arrow
              title={
                <h1
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "normal",
                  }}
                >
                  Brak produktów
                </h1>
              }
            >
              <span>
                <NavIconButton isButton={false} icon="bag" aria-hidden="true" />
              </span>
            </Tooltip>
          ) : (
            <Tooltip
              arrow
              title={
                <h1
                  style={{
                    color: "#fff",
                    fontSize: "16px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "normal",
                  }}
                >
                  Dodaj do koszyka
                </h1>
              }
            >
              <span>
                <NavIconButton isButton={false} icon="bag" aria-hidden="true" />
              </span>
            </Tooltip>
          )}
        </button>
        {isItemInWishlist(product) ? (
          <Tooltip
            title={
              <h1
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "normal",
                }}
              >
                Usuń z listy zyczeń
              </h1>
            }
            arrow
          >
            <button onClick={() => handleDeleteFromWishlist(product)} type="submit">
              <NavIconButton
                isButton={false}
                icon="heart"
                aria-hidden="true"
                className="w-7 h-7 fill-red-500"
              />
            </button>
          </Tooltip>
        ) : (
          <Tooltip
            arrow
            title={
              <h1
                style={{
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "normal",
                }}
              >
                Dodaj do listy zyczeń
              </h1>
            }
          >
            <button onClick={() => handleAddToWishlist(product)} type="submit" className="text-md">
              <NavIconButton
                isButton={false}
                icon="heart"
                aria-hidden="true"
                className="w-7 h-7 fill-black"
              />
            </button>
          </Tooltip>
        )}
      </div>
      {cartSlide && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      )}

      {cartSlide && <CartSlide isOpen={cartSlide} setIsOpen={setCartSlide} />}
    </li>
  );
}
