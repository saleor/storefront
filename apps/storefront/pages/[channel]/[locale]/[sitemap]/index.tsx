import { ApolloQueryResult } from "@apollo/client";
import { GetServerSideProps } from "next";
import { getServerSideSitemap } from "next-sitemap";

import {
  CategoryPathsDocument,
  CategoryPathsQuery,
  CollectionPathsDocument,
  CollectionPathsQuery,
  ProductPathsDocument,
  ProductPathsQuery,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let fields: { loc: string }[] = [];

  if (ctx.params) {
    if (ctx.params.sitemap === "category") {
      const result: ApolloQueryResult<CategoryPathsQuery | undefined> =
        await serverApolloClient.query({
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
    } else if (ctx.params.sitemap === "collection") {
      const result: ApolloQueryResult<CollectionPathsQuery | undefined> =
        await serverApolloClient.query({
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
    } else if (ctx.params.sitemap === "product") {
      const result: ApolloQueryResult<ProductPathsQuery | undefined> =
        await serverApolloClient.query({
          query: ProductPathsDocument,
          variables: {},
        });
      const paths =
        result.data?.products?.edges.map(({ node }) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path) => ({
        loc: `https://localhost:3001/product/${path.params.slug}`,
      }));
    }
  }
  return getServerSideSitemap(ctx, fields);
};

/* eslint @typescript-eslint/no-empty-function: off */
const Sitemap = () => {};

export default Sitemap;
