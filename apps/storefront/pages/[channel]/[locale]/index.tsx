import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";

import { HomepageBlock, Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { HOMEPAGE_MENU } from "@/lib/const";
import { contextToRegionQuery } from "@/lib/regions";
import {
  HomepageBlocksQuery,
  HomepageBlocksQueryDocument,
  HomepageBlocksQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const result: ApolloQueryResult<HomepageBlocksQuery> = await serverApolloClient.query<
    HomepageBlocksQuery,
    HomepageBlocksQueryVariables
  >({
    query: HomepageBlocksQueryDocument,
    variables: { slug: HOMEPAGE_MENU, ...contextToRegionQuery(context) },
  });
  return {
    props: {
      menuData: result?.data,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};
function Home({ menuData }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="container" />
        </header>
        <main>
          <div className="container">
            {menuData?.menu?.items?.map((m) => {
              if (!m) {
                return null;
              }
              return <HomepageBlock key={m.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </>
  );
}

export default Home;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
