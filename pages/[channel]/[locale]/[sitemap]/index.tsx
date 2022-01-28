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
      const result =
        await apolloClient.query(
          CategoryPathsDocument,
          {},
        ).toPromise();
      const paths =
        result.data?.categories?.edges.map(({ node }: any) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path: any) => ({
        loc: `https://localhost:3001/category/${path.params.slug}`,
      }));
    } else if (ctx.params["sitemap"] === "collection") {
      const result =
        await apolloClient.query(
          CollectionPathsDocument,
          {},
        ).toPromise();
      const paths =
        result.data?.collections?.edges.map(({ node }: any) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path: any) => ({
        loc: `https://localhost:3001/collection/${path.params.slug}`,
      }));
    } else if (ctx.params["sitemap"] === "product") {
      const result =
        await apolloClient.query(ProductPathsDocument, {}).toPromise();
      const paths =
        result.data?.products?.edges.map(({ node }: any) => ({
          params: { slug: node.slug },
        })) || [];
      fields = paths.map((path: any) => ({
        loc: `https://localhost:3001/product/${path.params.slug}`,
      }));
    }
  }
  return getServerSideSitemap(ctx, fields);
};

const Sitemap = () => {};

export default Sitemap;
