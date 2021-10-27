import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React from "react";

import { BaseTemplate, HomepageBlock } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";
import apolloClient from "@/lib/graphql";
import { MenuQuery, MenuQueryDocument } from "@/saleor/api";

const Home = ({ menuData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <BaseTemplate>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8"></div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            {menuData?.menu?.items?.map((m) => {
              if (!!m) return <HomepageBlock key={m?.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </BaseTemplate>
  );
};

export default Home;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const result: ApolloQueryResult<MenuQuery | undefined> =
    await apolloClient.query({
      query: MenuQueryDocument,
      variables: { slug: "homepage" },
    });
  return {
    props: {
      menuData: result?.data,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};
