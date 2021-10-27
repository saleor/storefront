import React from "react";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { ApolloQueryResult } from "@apollo/client";

import apolloClient from "@/lib/graphql";
import {
  CollectionPathsDocument,
  CollectionPathsQuery,
  useCollectionBySlugQuery,
} from "@/saleor/api";
import {
  BaseTemplate,
  ProductCollection,
  PageHero
} from "@/components";

import Custom404 from "pages/404";
import CollectionPageSeo from "@/components/seo/CollectionPageSeo";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      collectionSlug: context.params?.slug?.toString(),
    },
  };
};

const CollectionPage = ({ collectionSlug }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    loading,
    error,
    data: collectionData,
  } = useCollectionBySlugQuery({
    variables: { slug: collectionSlug || "" },
    skip: !collectionSlug,
  });

  if (loading) {
    return <BaseTemplate isLoading={true} />;
  }
  if (error) return <p>Error {error.message}</p>;

  const collection = collectionData?.collection;

  if (!collection) {
    return <Custom404 />;
  }
  return (
    <BaseTemplate>
      <CollectionPageSeo collection={collection} />
      <header className="mb-4 pt-4">
        <div className="max-w-7xl mx-auto px-8">
          <PageHero entity={collection} />
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-8">
          <ProductCollection filter={{ collections: [collection?.id] }} />
        </div>
      </main>
    </BaseTemplate>
  );
};

export default CollectionPage;

export async function getStaticPaths() {
  const result: ApolloQueryResult<CollectionPathsQuery | undefined> =
    await apolloClient.query({
      query: CollectionPathsDocument,
      variables: {},
    });

  const paths = result.data?.collections?.edges.map(({ node }) => ({
    params: { slug: node.slug },
  }));

  return {
    paths: paths,
    fallback: true,
  };
}
