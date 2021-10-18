import React, { useState } from "react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { ApolloQueryResult } from "@apollo/client";
import { useAuthState } from "@saleor/sdk";
import {
  useAddProductToCheckoutMutation,
  ProductPathsQuery,
  ProductPathsDocument,
  useCheckoutByTokenQuery,
  CheckoutError,
  useCreateCheckoutMutation,
  ProductBySlugDocument,
  ProductBySlugQuery,
} from "@/saleor/api";
import apolloClient from "@/lib/graphql";

import { ProductPageSeo } from "@/components/seo/ProductPageSeo";
import RichText from "@/components/RichText";
import BaseTemplate from "@/components/BaseTemplate";
import VariantSelector from "@/components/VariantSelector";
import { useLocalStorage } from "react-use";
import { CHECKOUT_TOKEN } from "@/lib/const";
import Custom404 from "pages/404";

const ProductPage: React.VFC<InferGetStaticPropsType<typeof getStaticProps>> =
  ({ productSSG }) => {
    const router = useRouter();
    const [checkoutToken, setCheckoutToken] = useLocalStorage(CHECKOUT_TOKEN);
    const [createCheckout] = useCreateCheckoutMutation();
    const { user } = useAuthState();

    const { data: checkoutData } = useCheckoutByTokenQuery({
      variables: { checkoutToken },
      skip: !checkoutToken || !process.browser,
    });
    const [addProductToCheckout] = useAddProductToCheckoutMutation();
    const [loadingAddToCheckout, setLoadingAddToCheckout] = useState(false);
    const [addToCartError, setAddToCartError] = useState("");

    const product = productSSG?.data?.product;
    if (!product?.id) {
      return <Custom404 />;
    }
    const price = product?.pricing?.priceRange?.start?.gross.localizedAmount;

    // We have to check if code is run on the browser
    // before we can use the router
    const queryVariant = process.browser
      ? router.query.variant?.toString()
      : undefined;
    const selectedVariantID = queryVariant || product?.variants![0]!.id!;

    const selectedVariant = product?.variants?.find(
      (v) => v?.id === selectedVariantID
    );

    const onAddToCart = async () => {
      // Clear previous error messages
      setAddToCartError("");

      // Block add to checkout button
      setLoadingAddToCheckout(true);
      const errors: CheckoutError[] = [];

      if (!!checkoutData?.checkout) {
        // If checkout is already existing, add products
        const { data: addToCartData } = await addProductToCheckout({
          variables: {
            checkoutToken: checkoutToken,
            variantId: selectedVariantID,
          },
        });
        addToCartData?.checkoutLinesAdd?.errors.forEach((e) => {
          if (!!e) {
            errors.push(e);
          }
        });
      } else {
        // Theres no checkout, we have to create one
        const { data: createCheckoutData } = await createCheckout({
          variables: {
            email: user?.email || "anonymous@example.com",
            lines: [
              {
                quantity: 1,
                variantId: selectedVariantID,
              },
            ],
          },
        });
        createCheckoutData?.checkoutCreate?.errors.forEach((e) => {
          if (!!e) {
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
        // Product successfully added, redirect to cart page
        router.push("/cart");
        return;
      }

      // Display error message
      const errorMessages =
        errors.map((e) => {
          return e.message || "";
        }) || [];
      setAddToCartError(errorMessages.join("\n"));
    };

    const productImage = product?.media![0];

    return (
      <BaseTemplate>
        <ProductPageSeo product={product} />

        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto pt-8 px-8">
          <div className="w-full aspect-w-1 aspect-h-1 ">
            {!!productImage && (
              <Image
                src={productImage.url}
                alt="Product cover image"
                layout="fill"
                objectFit="cover"
                className="w-full h-full object-center object-cover"
              />
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-800">
                {product?.name}
              </h1>
              <Link href={`/category/${product?.category?.slug}`} passHref>
                <p className="text-lg mt-2 font-medium text-gray-500 cursor-pointer">
                  {product?.category?.name}
                </p>
              </Link>
            </div>

            <p className="text-2xl text-gray-900">{price}</p>

            {product?.description && (
              <div className="text-base text-gray-700 space-y-6">
                <RichText jsonStringData={product.description} />
              </div>
            )}
            <VariantSelector
              product={product}
              selectedVariantID={selectedVariantID}
            />
            {selectedVariant && selectedVariant?.quantityAvailable > 0 ? (
              <button
                onClick={onAddToCart}
                type="submit"
                disabled={loadingAddToCheckout}
                className="max-w-xs w-full bg-blue-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none"
              >
                {loadingAddToCheckout ? "Adding..." : "Add to cart"}
              </button>
            ) : (
              <p className="text-lg- text-yellow-600">Sold out!</p>
            )}
            {!!addToCartError && <p>{addToCartError}</p>}
          </div>
        </main>
      </BaseTemplate>
    );
  };

export default ProductPage;

export async function getStaticPaths() {
  const result: ApolloQueryResult<ProductPathsQuery | undefined> =
    await apolloClient.query({
      query: ProductPathsDocument,
      variables: {},
    });
  const paths =
    result.data?.products?.edges.map(({ node }) => ({
      params: { slug: node.slug },
    })) || [];

  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const productSlug = context.params?.slug?.toString();
  const data: ApolloQueryResult<ProductBySlugQuery | undefined> =
    await apolloClient.query({
      query: ProductBySlugDocument,
      variables: {
        slug: productSlug,
      },
    });
  return {
    props: {
      productSSG: data,
    },
    revalidate: 60, // value in seconds, how often ISR will trigger on the server
  };
};
