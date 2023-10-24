import { gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ServerResponse } from "http";

const API_URI = "https://saleor-test.gammasoft.pl/graphql/";
const CHANNEL: string = process.env.NEXT_PUBLIC_DEFAULT_CHANNEL as string;
const HOST: string = process.env.STOREFRONT_URL as string;
const DEFAULT_PRODUCTS_SLUGS = 1000;
const DEFAULT_CATEGORIES_SLUGS = 1000;
const DEFAULT_PAGES_SLUGS = 1000;

type SitemapSlugs = {
  sitemapSlugs: {
    pagesSlugs?: string[];
    categoriesSlugs?: string[];
    productSlugs?: string[];
    salesIds?: string[];
  };
};
const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});

function generateSiteMap(data: SitemapSlugs) {
  let base = "";
  let pages = "";
  let categories = "";
  const sales = "";
  let products = "";
  let closer = "";

  base = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${HOST}/</loc>
    </url>
    <url>
      <loc>${HOST}/pl-PL/</loc>
    </url>`;

  if (data.sitemapSlugs.pagesSlugs) {
    pages = `${data.sitemapSlugs.pagesSlugs
      .map((slug: string) => {
        return `
      <url>
        <loc>${`${HOST}/pl-PL/page/${slug}/`}</loc>
      </url>`;
      })
      .join("")}`;
  }

  if (data.sitemapSlugs.categoriesSlugs) {
    categories = `${data.sitemapSlugs.categoriesSlugs
      .map((slug: string) => {
        return `
      <url>
        <loc>${`${HOST}/pl-PL/category/${slug}/`}</loc>
      </url>`;
      })
      .join("")}`;
  }

  if (data.sitemapSlugs.salesIds) {
    categories = `${data.sitemapSlugs.salesIds
      .map((id: string) => {
        return `
      <url>
        <loc>${`${HOST}/pl-PL/sale/${id}/`}</loc>
      </url>`;
      })
      .join("")}`;
  }

  if (data.sitemapSlugs.productSlugs) {
    products = `${data.sitemapSlugs.productSlugs
      .map((slug: string) => {
        return `
      <url>
        <loc>${`${HOST}/pl-PL/product/${slug}/`}</loc>
      </url>`;
      })
      .join("")}`;
  }

  closer = `</urlset>`;
  const sitemap = base + pages + categories + products + closer + sales;
  return sitemap;
}

function SiteMap() {}

export async function getServerSideProps({ res }: { res: ServerResponse }) {
  const { data } = await client.query({
    query: gql`
        query {
          sitemapSlugs(
              channel:"${CHANNEL}",
              productsAmount: ${DEFAULT_PRODUCTS_SLUGS},
              categoriesAmount: ${DEFAULT_CATEGORIES_SLUGS},
              pagesAmount: ${DEFAULT_PAGES_SLUGS}
              ){
              productSlugs
              categoriesSlugs
              # TODO: Add sales to sitemapSlugs query
              salesIds
              pagesSlugs
          }}
        `,
  });

  const posts: SitemapSlugs = await data;

  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
