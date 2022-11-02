import { graphql } from "msw";

export const saleorApi = graphql.link(process.env.NEXT_PUBLIC_SALEOR_API_URL!);

export const prepareGraphqlMetafields = (keys: string[], metafields: Record<string, any>) => {
  return keys.reduce(
    (allKeys, key) => ({
      ...allKeys,
      [key]: JSON.stringify(metafields[key]),
    }),
    {}
  );
};
