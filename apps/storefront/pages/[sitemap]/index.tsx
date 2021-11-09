import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import apolloClient from "@/lib/graphql";
import {
  CategoryPathsDocument,
  CategoryPathsQuery,
  CollectionPathsDocument,
  CollectionPathsQuery,
  ProductPathsDocument,
  ProductPathsQuery,
} from "@/saleor/api";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let fields: { loc: string }[] = [];

  if (ctx.params) {
    if (ctx.params["sitemap"] === "category") {
      const result: ApolloQueryResult<CategoryPathsQuery | undefined> =
        await apolloClient.query({
          query: CategoryPathsDocument,
          variables: {},
        });
      const paths =
        result.data?.categories?.edges.map(({ node }) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path) => ({
        loc: `https://localhost:3001/category/${path.params.slug}`,
      }));
    } else if (ctx.params["sitemap"] === "collection") {
      const result: ApolloQueryResult<CollectionPathsQuery | undefined> =
        await apolloClient.query({
          query: CollectionPathsDocument,
          variables: {},
        });
      const paths =
        result.data?.collections?.edges.map(({ node }) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path) => ({
        loc: `https://localhost:3001/collection/${path.params.slug}`,
      }));
    } else if (ctx.params["sitemap"] === "products") {
      const result: ApolloQueryResult<ProductPathsQuery | undefined> =
        await apolloClient.query({
          query: ProductPathsDocument,
          variables: {},
        });
      const paths =
        result.data?.products?.edges.map(({ node }) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path) => ({
        loc: `https://localhost:3001/products/${path.params.slug}`,
      }));
    }
  }
  return getServerSideSitemap(ctx, fields);
};

const Sitemap = () => {};

export default Sitemap;
