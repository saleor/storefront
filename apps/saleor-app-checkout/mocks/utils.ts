import { graphql } from "msw";

export const saleorApi = graphql.link("saleor-api-host.saleor.localhost:8000");

export const prepareGraphqlMetafields = (keys: string[], metafields: Record<string, any>) => {
  return keys.reduce(
    (allKeys, key) => ({
      ...allKeys,
      [key]: JSON.stringify(metafields[key]),
    }),
    {}
  );
};
