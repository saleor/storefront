import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import { ReactElement } from "react";

import { Layout, RichText } from "@/components";
import apolloClient from "@/lib/graphql";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import { PageDocument, PageQuery, PageQueryVariables } from "@/saleor/api";

export interface pathParams {
  channel: string;
  locale: string;
  slug: string;
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const pageSlug = context.params?.slug?.toString()!;
  const response: ApolloQueryResult<PageQuery> = await apolloClient.query<
    PageQuery,
    PageQueryVariables
  >({
    query: PageDocument,
    variables: {
      slug: pageSlug,
      locale: contextToRegionQuery(context).locale,
    },
  });
  return {
    props: {
      page: response.data.page,
    },
  };
};
function PagePage({ page }: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!page?.id) {
    return <Custom404 />;
  }

  const content = translate(page, "content");

  return (
    <main className="container pt-8 px-8">{content && <RichText jsonStringData={content} />}</main>
  );
}

export default PagePage;

PagePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
