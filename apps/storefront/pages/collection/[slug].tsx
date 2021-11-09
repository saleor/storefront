import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero, ProductCollection, Spinner } from "@/components";
import CollectionPageSeo from "@/components/seo/CollectionPageSeo";
import apolloClient from "@/lib/graphql";
import {
  CollectionPathsDocument,
  CollectionPathsQuery,
  useCollectionBySlugQuery,
} from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      collectionSlug: context.params?.slug?.toString(),
    },
  };
};

const CollectionPage = ({
  collectionSlug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    loading,
    error,
    data: collectionData,
  } = useCollectionBySlugQuery({
    variables: { slug: collectionSlug || "" },
    skip: !collectionSlug,
  });

  if (loading) {
    return <Spinner />;
  }
  if (error) return <p>Error {error.message}</p>;

  const collection = collectionData?.collection;

  if (!collection) {
    return <Custom404 />;
  }
  return (
    <>
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
    </>
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

CollectionPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
