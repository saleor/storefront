import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { ApolloQueryResult } from "@apollo/client";
import Blocks from "editorjs-blocks-react-renderer";

import { Navbar } from "@/components";

import {
  useAddProductToCheckoutMutation,
  ProductPathsQuery,
  useProductBySlugQuery,
  ProductPathsDocument,
} from "@/saleor/api";

import apolloClient from "@/lib/graphql";

import React from "react";
import { ProductPageSeo } from "@/components/seo/ProductPageSeo";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      productSlug: context.params?.slug?.toString(),
      token: "",
    },
  };
};

const ProductPage: React.VFC<InferGetStaticPropsType<typeof getStaticProps>> =
  ({ productSlug, token }) => {
    const router = useRouter();

    const { loading, error, data } = useProductBySlugQuery({
      variables: { slug: productSlug || "" },
    });
    const [addProductToCheckout] = useAddProductToCheckoutMutation();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    if (!data || !data.product) {
      return null;
    }

    const { product } = data;
    const price = product?.pricing?.priceRange?.start?.gross.localizedAmount;

    const selectedVariantId =
      router.query.variant?.toString() || product?.variants![0]!.id!;

    const onAddToCart = async () => {
      await addProductToCheckout({
        variables: { checkoutToken: token, variantId: selectedVariantId },
      });
      router.push("/cart");
    };

    const productImage = product?.media![0];

    return (
      <>
        <ProductPageSeo product={product} />
        <div className="min-h-screen bg-gray-100">
          <Navbar />

          <main className="max-w-7xl mx-auto pt-8 px-8">
            <div className="grid grid-cols-2 gap-x-10 items-start">
              <div className="w-full aspect-w-1 aspect-h-1 bg-white rounded">
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
                  <p className="text-lg mt-2 font-medium text-gray-500">
                    {product?.category?.name}
                  </p>
                </div>

                <p className="text-2xl text-gray-900">{price}</p>

                {product?.description && (
                  <div className="text-base text-gray-700 space-y-6">
                    <article className="prose lg:prose-s">
                      <Blocks data={JSON.parse(product.description)} />
                    </article>
                  </div>
                )}
                {(product?.variants?.length || 0) > 1 && (
                  <div className="grid grid-cols-8 gap-2">
                    {product?.variants?.map((variant) => {
                      return (
                        <Link
                          key={variant?.name}
                          href={{
                            pathname: "/products/[slug]",
                            query: { variant: variant?.id, slug: productSlug },
                          }}
                          replace
                          shallow
                        >
                          <a
                            className={`flex justify-center border rounded-md p-3 font-semibold hover:border-blue-400 ${
                              variant?.id === selectedVariantId
                                ? "border-blue-300"
                                : "border-gray-300"
                            }`}
                          >
                            {variant?.name}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
                <button
                  onClick={onAddToCart}
                  type="submit"
                  className="max-w-xs w-full bg-blue-500 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-white hover:bg-blue-600 focus:outline-none"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </main>
        </div>
      </>
    );
  };

export default ProductPage;

export async function getStaticPaths() {
  const result: ApolloQueryResult<ProductPathsQuery | undefined> =
    await apolloClient.query({
      query: ProductPathsDocument,
      variables: {},
    });
  const paths = !!result
    ? result.data?.products?.edges.map(({ node }) => ({
        params: { slug: node.slug },
      }))
    : [];

  return {
    paths,
    fallback: true,
  };
}
