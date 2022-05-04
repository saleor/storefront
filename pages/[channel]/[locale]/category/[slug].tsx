import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero } from "@/components";
import { FilteredProductList } from "@/components/productList/FilteredProductList/FilteredProductList";
import { CategoryPageSeo } from "@/components/seo/CategoryPageSeo";
import apolloClient from "@/lib/graphql";
import { contextToRegionQuery } from "@/lib/regions";
import {
  AttributeFilterFragment,
  CategoryBySlugDocument,
  CategoryBySlugQuery,
  CategoryBySlugQueryVariables,
  FilteringAttributesQuery,
  FilteringAttributesQueryDocument,
  FilteringAttributesQueryVariables,
} from "@/saleor/api";

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const categorySlug = context.params?.slug?.toString()!;
  const response: ApolloQueryResult<CategoryBySlugQuery> = await apolloClient.query<
    CategoryBySlugQuery,
    CategoryBySlugQueryVariables
  >({
    query: CategoryBySlugDocument,
    variables: {
      slug: categorySlug,
      locale: contextToRegionQuery(context).locale,
    },
  });

  const attributesResponse: ApolloQueryResult<FilteringAttributesQuery> = await apolloClient.query<
    FilteringAttributesQuery,
    FilteringAttributesQueryVariables
  >({
    query: FilteringAttributesQueryDocument,
    variables: {
      ...contextToRegionQuery(context),
      filter: {
        inCategory: response.data.category?.id,
      },
    },
  });

  let attributes: AttributeFilterFragment[] =
    attributesResponse.data.attributes?.edges.map((e) => e.node) || [];
  attributes = attributes.filter((attribute) => attribute.choices?.edges.length);

  return {
    props: {
      category: response.data.category,
      attributeFiltersData: attributes,
    },
  };
};

function CategoryPage({
  category,
  attributeFiltersData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!category) {
    return <Custom404 />;
  }

  return (
    <>
      <CategoryPageSeo category={category} />
      <header className="mb-4 pt-4">
        <div className="container px-8">
          <PageHero entity={category} />
        </div>
      </header>
      <main>
        <div className="container px-8 mt-4">
          <FilteredProductList
            attributeFiltersData={attributeFiltersData}
            categoryIDs={[category.id]}
          />
        </div>
      </main>
    </>
  );
}

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
