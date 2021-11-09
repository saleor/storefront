import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero, ProductCollection, Spinner } from "@/components";
import CategoryPageSeo from "@/components/seo/CategoryPageSeo";
import apolloClient from "@/lib/graphql";
import {
  CategoryPathsDocument,
  CategoryPathsQuery,
  useCategoryBySlugQuery,
} from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      categorySlug: context.params?.slug?.toString(),
    },
  };
};

const CategoryPage = ({
  categorySlug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    loading,
    error,
    data: categoryData,
  } = useCategoryBySlugQuery({
    variables: { slug: categorySlug || "" },
    skip: !categorySlug,
  });

  if (loading) {
    return <Spinner />;
  }
  if (error) return <p>Error</p>;

  const category = categoryData?.category;

  if (!category) {
    return <Custom404 />;
  }

  return (
    <>
      <CategoryPageSeo category={category} />
      <header className="mb-4 pt-4">
        <div className="max-w-7xl mx-auto px-8">
          <PageHero entity={category} />
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto px-8">
          <ProductCollection filter={{ categories: [category?.id] }} />
        </div>
      </main>
    </>
  );
};

export default CategoryPage;

export async function getStaticPaths() {
  const result: ApolloQueryResult<CategoryPathsQuery | undefined> =
    await apolloClient.query({
      query: CategoryPathsDocument,
      variables: {},
    });
  const paths =
    result.data?.categories?.edges.map(({ node }) => ({
      params: { slug: node.slug },
    })) || [];

  return {
    paths: paths,
    fallback: true,
  };
}

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
