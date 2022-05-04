import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero, ProductCollection } from "@/components";
import { CollectionPageSeo } from "@/components/seo/CollectionPageSeo";
import apolloClient from "@/lib/graphql";
import { contextToRegionQuery } from "@/lib/regions";
import {
  CollectionBySlugDocument,
  CollectionBySlugQuery,
  CollectionBySlugQueryVariables,
} from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const collectionSlug = context.params?.slug?.toString()!;
  const response: ApolloQueryResult<CollectionBySlugQuery> = await apolloClient.query<
    CollectionBySlugQuery,
    CollectionBySlugQueryVariables
  >({
    query: CollectionBySlugDocument,
    variables: {
      slug: collectionSlug,
      ...contextToRegionQuery(context),
    },
  });
  return {
    props: {
      collection: response.data.collection,
    },
  };
};
function CollectionPage({ collection }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!collection) {
    return <Custom404 />;
  }
  return (
    <>
      <CollectionPageSeo collection={collection} />
      <header className="mb-4 pt-4">
        <div className="container px-8">
          <PageHero entity={collection} />
        </div>
      </header>
      <main>
        <div className="container px-8">
          <ProductCollection filter={{ collections: [collection?.id] }} />
        </div>
      </main>
    </>
  );
}

export default CollectionPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

CollectionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
