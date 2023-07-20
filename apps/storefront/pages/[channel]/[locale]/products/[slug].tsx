import { ApolloQueryResult } from "@apollo/client";
import clsx from "clsx";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import React, { ReactElement, useState } from "react";
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
  useCheckoutAddProductLineMutation,
  useCreateCheckoutMutation,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import { Tabs } from "@/components/Tabs/Tabs";
import { DiscountInfo } from "@/components/DiscountInfo/DiscountInfo";
import { ProductInfoGrid } from "@/components/ProductInfoGrid/ProductInfoGrid";

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

  if (!product?.id) {
    return <Custom404 />;
  }

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

  return (
    <>
      <ProductPageSeo product={product} />
      <main className="container gap-[3rem] pt-8 px-8 flex flex-col md:flex-row justify-between bg-white mt-[42px]">
        <button
          type="button"
          onClick={() => history.back()}
          className="mt-6 py-3 px-12 w-max rounded-lg text-base bg-brand text-white hover:text-brand hover:bg-white border-2 border-brand focus:outline-none transition"
        >
          Powrót
        </button>
      </main>
      <main className="container gap-[3rem] pt-8 px-8 flex flex-col md:flex-row justify-between bg-white mt-[42px]">
        <div className="md:flex-grow md:flex md:gap-x-8 md:mt-0 lg:mt-[24px]">
          <div className="flex-grow-2 w-full md:w-1/2 lg:w-1/2 xl:w-2/3 md:pb-0 md:pr-8 box-border">
            <ProductGallery product={product} selectedVariant={selectedVariant} />
          </div>
          <div className="flex-grow w-full md:w-1/2 lg:w-1/2 xl:w-1/3 relative mt-8 md:mt-0">
            <div className="flex flex-col space-y-8">
              <h1 className="text-5xl font-bold text-gray-800" data-testid="productName">
                {translate(product, "name")}
              </h1>
              <div className="flex flex-row items-center gap-6">
                {shouldDisplayPrice && (
                  <h2 className="text-xl font-bold text-gray-800">{formatPrice(price)}</h2>
                )}
                <div className="flex flex-row gap-6 items-center">
                  <div className="line-through text-lg text-gray-400">
                    {formatPrice(undiscountedPrice)}
                  </div>

                  <DiscountInfo isOnSale={isOnSale} product={product} />
                </div>
              </div>

              <VariantSelector product={product} selectedVariantID={selectedVariantID} />

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

              {!selectedVariant && (
                <p className="mt-6 text-base text-red-500">
                  {t.formatMessage(messages.variantNotChosen)}
                </p>
              )}

              {selectedVariant?.quantityAvailable === 0 && (
                <p className="mt-6 text-base text-red-500" data-testid="soldOut">
                  {t.formatMessage(messages.soldOut)}
                </p>
              )}

              {!!addToCartError && (
                <p className="text-red-700 text-sm font-bold">{addToCartError}</p>
              )}

              <div className="bg-slate-100 w-full h-[1px]"></div>

              <ProductInfoGrid />
            </div>
          </div>
        </div>
      </main>

      <div className="w-full break-words container mt-32">
        <Tabs product={product} selectedVariant={selectedVariant} />
      </div>
    </>
  );
}

export default ProductPage;

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
