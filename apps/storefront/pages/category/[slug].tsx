import { ProductCollection, Navbar } from "@/components";
import CategoryHero from "@/components/CategoryHero";
import CategoryPageSeo from "@/components/seo/CategoryPageSeo";
import {
  CategoryPathsDocument,
  CategoryPathsQuery,
  useCategoryBySlugQuery,
} from "@/saleor/api";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React from "react";
import Custom404 from "pages/404";
import apolloClient from "@/lib/graphql";
import { ApolloQueryResult } from "@apollo/client";
import Spinner from "@/components/Spinner";
import BaseTemplate from "@/components/BaseTemplate";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      categorySlug: context.params?.slug?.toString(),
    },
  };
};

const CategoryPage: React.VFC<InferGetStaticPropsType<typeof getStaticProps>> =
  ({ categorySlug }) => {
    const {
      loading,
      error,
      data: categoryData,
    } = useCategoryBySlugQuery({
      variables: { slug: categorySlug || "" },
      skip: !categorySlug,
    });

    if (loading) {
      return <BaseTemplate isLoading={true} />;
    }
    if (error) return <p>Error</p>;

    const category = categoryData?.category;

    if (!category) {
      return <Custom404 />;
    }

    return (
      <BaseTemplate>
        <CategoryPageSeo category={category} />
        <header className="mb-4 pt-4">
          <div className="max-w-7xl mx-auto px-8">
            <CategoryHero category={category} />
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            <ProductCollection filter={{ categories: [category?.id] }} />
          </div>
        </main>
      </BaseTemplate>
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
