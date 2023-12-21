import { ApolloQueryResult } from "@apollo/client";
import clsx from "clsx";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import React, { ReactElement, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { Layout, VariantSelector } from "@/components";
import { useRegions } from "@/components/RegionsProvider";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPageSeo } from "@/components/seo/ProductPageSeo";
import { messages } from "@/components/translations";
import { getSelectedVariantID } from "@/lib/product";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import { useUser } from "@/lib/useUser";
import {
  CheckoutError,
  ProductBySlugDocument,
  ProductBySlugQuery,
  ProductBySlugQueryVariables,
  ProductDetailsFragment,
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import { Tabs } from "@/components/Tabs/Tabs";
import { DiscountInfo } from "@/components/DiscountInfo/DiscountInfo";
import { ProductInfoGrid } from "@/components/ProductInfoGrid/ProductInfoGrid";

import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";
import { STOREFRONT_NAME } from "@/lib/const";
import { useWishlist } from "context/WishlistContext";
import Heart from "../../../components/Navbar/heart.svg";
import { CartSlide } from "@/components/CustomCart/CartSlide";

export type OptionalQuery = {
  variant?: string;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; slug: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const productSlug = context.params.slug.toString();
  const response: ApolloQueryResult<ProductBySlugQuery> = await serverApolloClient.query<
    ProductBySlugQuery,
    ProductBySlugQueryVariables
  >({
    query: ProductBySlugDocument,
    variables: {
      slug: productSlug,
      ...contextToRegionQuery(context),
    },
  });
  return {
    props: {
      product: response.data.product,
    },
    revalidate: 60, // value in seconds, how often ISR will trigger on the server
  };
};
function ProductPage({ product }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  const t = useIntl();
  const { currentChannel, formatPrice, query } = useRegions();

  const { checkoutToken, setCheckoutToken, checkout } = useCheckout();

  const [createCheckout] = useCreateCheckoutMutation();
  const { user } = useUser();

  const [addProductToCheckout] = useCheckoutAddProductLineMutation();
  const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false);
  const [addToCartError, setAddToCartError] = useState("");
  const [cartSlide, setCartSlide] = useState(false);

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();

  const isItemInWishlist = (product: ProductDetailsFragment) => {
    return wishlist.some((item) => item.id === product?.id);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAddToWishlist = async (product: ProductDetailsFragment) => {
    if (product) {
      addToWishlist(product);
    }
  };

  const handleDeleteFromWishlist = (product: ProductDetailsFragment) => {
    removeFromWishlist(product.id);
  };

  if (!product?.id) {
    return <Custom404 />;
  }

  const selectedVariantID = getSelectedVariantID(product, router);

  const selectedVariant = product?.variants?.find((v) => v?.id === selectedVariantID) || undefined;

  const onAddToCart = async () => {
    setAddToCartError("");

    setLoadingAddToCheckout(true);
    const errors: CheckoutError[] = [];

    if (!selectedVariantID) {
      return;
    }

    if (checkout?.lines.length) {
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

  const price = product.pricing?.priceRange?.start?.gross;
  const shouldDisplayPrice = product.variants?.length === 1 && price;

  const isOnSale = product?.pricing?.onSale;

  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <ProductPageSeo product={product} />
      <main className="gap-[3rem] xl:pl-52 flex flex-col md:flex-row justify-between bg-white mt-[42px] lg:pl-30 md:pl-30 sm:pl-10 pl-12">
        <button
          type="button"
          onClick={() => history.back()}
          className="mt-6 py-3 px-12 w-max rounded-full text-base bg-brand text-white hover:text-brand hover:bg-white border-2 border-brand focus:outline-none transition"
        >
          {t.formatMessage(messages.backButton)}
        </button>
      </main>
      <main className="xl:mx-8 lg:mx-12 mx-4 gap-[3rem] flex flex-col md:flex-row justify-between bg-white">
        <div className="md:flex-grow md:flex md:gap-x-8 md:mt-0 lg:mt-[24px] container lg:mx-30 xl:mx-40 pt-4 md:pt-4">
          <div className="flex-grow-2 w-full md:w-1/2 lg:w-1/2 xl:w-1/2 md:pb-0 md:pr-8 box-border">
            <ProductGallery product={product} selectedVariant={selectedVariant} />
          </div>
          <div className="flex-grow w-full md:w-1/3 lg:w-1/3 xl:w-1/3 relative mt-8 md:mt-0">
            <div className="flex flex-col space-y-8">
              <h1
                className="text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-bold text-gray-800"
                data-testid="productName"
              >
                {translate(product, "name")}
              </h1>
              <div className="flex flex-row items-center gap-6">
                {shouldDisplayPrice && (
                  <h2 className="text-lg sm:text-5xl md:text-3xl lg:text-xl font-bold text-gray-800">
                    {formatPrice(price)}
                  </h2>
                )}
                {isOnSale && (
                  <div className="flex flex-row gap-6 items-center">
                    <div className="line-through text-lg md:text-3xl sm:text-5xl lg:text-xl text-gray-400">
                      {formatPrice(undiscountedPrice)}
                    </div>
                  </div>
                )}
                <DiscountInfo isOnSale={isOnSale} product={product} />
              </div>

              <VariantSelector product={product} selectedVariantID={selectedVariantID} />
              <div className="flex flex-col items-start gap-8">
                <button
                  onClick={onAddToCart}
                  type="submit"
                  disabled={isAddToCartButtonDisabled}
                  className={clsx(
                    "mt-6 py-3 text-md px-12 w-max rounded-lg text-white bg-brand border-2 border-brand transition-all ease-in-out duration-300 focus:outline-none",
                    {
                      "border-gray-300 bg-gray-300 cursor-not-allowed": isAddToCartButtonDisabled,
                      "hover:bg-white hover:text-brand hover:border-brand":
                        !isAddToCartButtonDisabled,
                    }
                  )}
                  data-testid="addToCartButton"
                >
                  {loadingAddToCheckout
                    ? t.formatMessage(messages.adding)
                    : t.formatMessage(messages.addToCart)}
                </button>
                {isItemInWishlist(product) ? (
                  <button
                    onClick={() => handleDeleteFromWishlist(product)}
                    type="submit"
                    data-testid="addToWishlistButton"
                    className="flex flex-row gap-3 items-center"
                  >
                    <Heart width="22" height="22" />
                    <p className="text-lg">{t.formatMessage(messages.deleteFromWishlist)}</p>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    type="submit"
                    data-testid="addToWishlistButton"
                    className="flex flex-row gap-3 items-center"
                  >
                    <Heart width="22" height="22" />
                    <p className="text-lg">{t.formatMessage(messages.addToWishlist)}</p>
                  </button>
                )}
              </div>

              {!selectedVariant && (
                <p className="mt-6 text-base text-red-500">
                  {t.formatMessage(messages.variantNotChosen)}
                </p>
              )}

              {selectedVariant?.quantityAvailable === 0 && (
                <p
                  className="mt-6 text-md text-white bg-red-500 text-center py-3 px-8 rounded-full w-max"
                  data-testid="soldOut"
                >
                  {t.formatMessage(messages.soldOut)}
                </p>
              )}

              {!!addToCartError && (
                <p className="text-red-700 text-sm font-bold">{addToCartError}</p>
              )}

              <div className="bg-slate-100 w-full h-[1px]"></div>
              <div className="flex flex-row gap-4">
                <FacebookShareButton
                  url={shareUrl}
                  quote={"next-share is a social share buttons for your next React apps."}
                  hashtag={"#ecommerce"}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <EmailShareButton
                  url={shareUrl}
                  subject={`${product?.name} - Produkt sklepu ${STOREFRONT_NAME}`}
                  body="Sprawdź produkt, który Ci polecam"
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
                <TwitterShareButton
                  url={shareUrl}
                  title={`${product?.name} - Produkt sklepu ${STOREFRONT_NAME} Sprawdź produkt, który Ci polecam`}
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>
                <WhatsappShareButton
                  url={shareUrl}
                  title={"next-share is a social share buttons for your next React apps."}
                  separator=":: "
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
              </div>
              <ProductInfoGrid />
            </div>
          </div>
        </div>
      </main>

      {cartSlide && (
        <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      )}

      {cartSlide && <CartSlide isOpen={cartSlide} setIsOpen={setCartSlide} />}

      <div className="container break-words xl:mx-16 mt-32">
        <Tabs product={product} selectedVariant={selectedVariant} />
      </div>
    </>
  );
}

export default ProductPage;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
