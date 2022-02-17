import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next/types";

import { RichText } from "@/components/RichText";
import apolloClient from "@/lib/graphql";
import {
  ProductBySlugDocument,
  ProductBySlugQuery,
  ProductBySlugQueryVariables,
} from "@/saleor/api";

const Timed = ({ product }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <h1>This is on demand revalidation test</h1>
      <h2>{product?.name}</h2>
      <h4>Product description:</h4>
      {product?.description && (
        <div className="text-base text-gray-700 space-y-6">
          <RichText jsonStringData={product.description} />
        </div>
      )}
      <p></p>
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const productSlug = "master-of-puppets";
  const response: ApolloQueryResult<ProductBySlugQuery> =
    await apolloClient.query<ProductBySlugQuery, ProductBySlugQueryVariables>({
      query: ProductBySlugDocument,
      variables: {
        slug: productSlug,
        channel: "records",
        locale: "EN",
      },
    });
  return {
    props: {
      product: response.data.product,
    },
    revalidate: 60 * 60 * 24, // value in seconds, how often ISR will trigger on the server
  };
};

export default Timed;
