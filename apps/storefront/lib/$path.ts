import type { OptionalQuery as OptionalQuery0 } from "../pages/account/login";
import type { OptionalQuery as OptionalQuery1 } from "../pages/products/[slug]";

export const pagesPath = {
  $404: {
    $url: (url?: { hash?: string }) => ({ pathname: "/404" as const, hash: url?.hash }),
  },
  _sitemap: (sitemap: string | number) => ({
    $url: (url?: { hash?: string }) => ({
      pathname: "/[sitemap]" as const,
      query: { sitemap },
      hash: url?.hash,
    }),
  }),
  account: {
    addressBook: {
      $url: (url?: { hash?: string }) => ({
        pathname: "/account/addressBook" as const,
        query: {},
        hash: url?.hash,
      }),
    },
    login: {
      $url: (url?: { query?: OptionalQuery0; hash?: string }) => ({
        pathname: "/account/login" as const,
        query: { ...url?.query },
        hash: url?.hash,
      }),
    },
    orders: {
      $url: (url?: { hash?: string }) => ({
        pathname: "/account/orders" as const,
        query: {},
        hash: url?.hash,
      }),
      _token: (token: string | number) => ({
        $url: (url?: { hash?: string }) => ({
          pathname: "/account/orders/[token]" as const,
          query: { token },
          hash: url?.hash,
        }),
      }),
    },
    preferences: {
      $url: (url?: { hash?: string }) => ({
        pathname: "/account/preferences" as const,
        query: {},
        hash: url?.hash,
      }),
    },
    register: {
      $url: (url?: { hash?: string }) => ({
        pathname: "/account/register" as const,
        query: {},
        hash: url?.hash,
      }),
    },
  },
  category: {
    _slug: (slug: string | number) => ({
      $url: (url?: { hash?: string }) => ({
        pathname: "/category/[slug]" as const,
        query: { slug },
        hash: url?.hash,
      }),
    }),
  },
  checkout: {
    $url: (url?: { hash?: string }) => ({
      pathname: "/checkout" as const,
      query: {},
      hash: url?.hash,
    }),
  },
  collection: {
    _slug: (slug: string | number) => ({
      $url: (url?: { hash?: string }) => ({
        pathname: "/collection/[slug]" as const,
        query: { slug },
        hash: url?.hash,
      }),
    }),
  },
  order: {
    $url: (url?: { hash?: string }) => ({
      pathname: "/order" as const,
      query: {},
      hash: url?.hash,
    }),
  },
  wishlist: {
    $url: (url?: { hash?: string }) => ({
      pathname: "/wishlist" as const,
      hash: url?.hash,
    }),
  },
  page: {
    _slug: (slug: string | number) => ({
      $url: (url?: { hash?: string }) => ({
        pathname: "/page/[slug]" as const,
        query: { slug },
        hash: url?.hash,
      }),
    }),
  },
  products: {
    _slug: (slug: string | number) => ({
      $url: (url?: { query?: OptionalQuery1; hash?: string }) => ({
        pathname: "/products/[slug]" as const,
        query: { slug, ...url?.query },
        hash: url?.hash,
      }),
    }),
  },
  search: {
    $url: (url?: { hash?: string }) => ({
      pathname: "/search" as const,
      query: {},
      hash: url?.hash,
    }),
  },
  $url: (url?: { hash?: string }) => ({
    pathname: "" as const,
    query: {},
    hash: url?.hash,
  }),
  $baseurl: (url?: { hash?: string }) => ({ pathname: "/" as const, hash: url?.hash }),
};

export type PagesPath = typeof pagesPath;
