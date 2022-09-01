import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import Custom404 from "pages/404";
import React, { ReactElement } from "react";

import { Layout, PageHero } from "@/components";
import { FilteredProductList } from "@/components/productList/FilteredProductList/FilteredProductList";
import { CategoryPageSeo } from "@/components/seo/CategoryPageSeo";
import apolloClient from "@/lib/graphql";
import { mapEdgesToItems } from "@/lib/maps";
import { usePaths } from "@/lib/paths";
import { contextToRegionQuery } from "@/lib/regions";
import { translate } from "@/lib/translations";
import {
  AttributeFilterFragment,
  CategoryBySlugDocument,
  CategoryBySlugQuery,
  CategoryBySlugQueryVariables,
  FilteringAttributesQuery,
  FilteringAttributesQueryDocument,
  FilteringAttributesQueryVariables,
} from "@/saleor/api";

export const getStaticProps = async (
  context: GetStaticPropsContext<{ channel: string; locale: string; slug: string }>
) => {
  if (!context.params) {
    return {
      props: {},
      notFound: true,
    };
  }

  const categorySlug = context.params.slug.toString();
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

  const attributes: AttributeFilterFragment[] = mapEdgesToItems(
    attributesResponse.data.attributes
  ).filter((attribute) => attribute.choices?.edges.length);

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
  const paths = usePaths();
  const router = useRouter();

  if (!category) {
    return <Custom404 />;
  }

  const subcategories = mapEdgesToItems(category.children);

  const navigateToCategory = (categorySlug: string) => {
    void router.push(paths.category._slug(categorySlug).$url());
  };

  return (
    <>
      <CategoryPageSeo category={category} />
      <header className="mb-4 pt-4">
        <div className="container px-8">
          <PageHero
            title={translate(category, "name")}
            description={translate(category, "description") || ""}
            pills={subcategories.map((subcategory) => ({
              label: translate(subcategory, "name"),
              onClick: () => navigateToCategory(subcategory.slug),
            }))}
          />
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
