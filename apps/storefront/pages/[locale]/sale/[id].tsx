import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout } from "@/components";
import { contextToRegionQuery } from "@/lib/regions";
import { SaleByIdDocument, SaleByIdQuery, SaleByIdQueryVariables } from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import { ProductCollectionSale } from "@/components/ProductCollectionSale";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; id: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const saleId = context.params.id.toString();
  try {
    const response = await serverApolloClient.query<SaleByIdQuery, SaleByIdQueryVariables>({
      query: SaleByIdDocument,
      variables: {
        id: saleId,
        ...contextToRegionQuery(context),
      },
    });

    return {
      props: {
        sale: response?.data.externalSale,
      },
    };
  } catch (error) {
    console.error("GraphQL error:", error);
    return {
      props: {
        error: "An error occurred while fetching data",
      },
    };
  }
};

function SalePage({ sale }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!sale) {
    return <Custom404 />;
  }
  return (
    <>
      <header className="mb-4 pt-4"></header>
      <div className="container px-8 mt-4">
        <ProductCollectionSale perPage={12} />
      </div>
    </>
  );
}

export default SalePage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

SalePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
