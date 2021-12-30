import { ApolloQueryResult } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import React, { ReactElement } from "react";

import { HomepageBlock, Layout } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";
import apolloClient from "@/lib/graphql";
import { contextToRegionQuery } from "@/lib/regions";
import { homepagePaths } from "@/lib/ssr/homepage";
import {
  HomepageBlocksQuery,
  HomepageBlocksQueryDocument,
  HomepageBlocksQueryVariables,
} from "@/saleor/api";

const Home = ({ menuData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8"></div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            {menuData?.menu?.items?.map((m) => {
              if (!!m) return <HomepageBlock key={m.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = homepagePaths();
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const result: ApolloQueryResult<HomepageBlocksQuery> =
    await apolloClient.query<HomepageBlocksQuery, HomepageBlocksQueryVariables>(
      {
        query: HomepageBlocksQueryDocument,
        variables: { slug: "homepage", ...contextToRegionQuery(context) },
      }
    );
  return {
    props: {
      menuData: result?.data,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
