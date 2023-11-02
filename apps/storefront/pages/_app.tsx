import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import React, { ReactElement, ReactNode, useEffect, useRef } from "react";

import { DemoBanner } from "@/components/DemoBanner";
import { RegionsProvider } from "@/components/RegionsProvider";
import { BaseSeo } from "@/components/seo/BaseSeo";
import typePolicies from "@/lib/auth/typePolicies";
import { API_URI, DEMO_MODE, GA_TRACKING_ID } from "@/lib/const";
import { CheckoutProvider } from "@/lib/providers/CheckoutProvider";
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from "@saleor/auth-sdk/react";
import { useAuthenticatedApolloClient } from "@saleor/auth-sdk/react/apollo";
import { WishlistProvider } from "context/WishlistContext";
import { useRouter } from "next/router";
import { UnderConstruction } from "@/components/UnderConstruction/UnderConstruction";
import CookieBanner from "@/components/CookieBanner";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  const router = useRouter();

  const scrollCache = useRef<Record<string, [number, number]>>({});
  const activeRestorePath = useRef<string>();

  useEffect(() => {
    if (history.scrollRestoration !== "manual") {
      history.scrollRestoration = "manual";
    }
    const getCurrentPath = () => location.pathname + location.search;
    router.beforePopState(() => {
      activeRestorePath.current = getCurrentPath();
      return true;
    });
    const onComplete = () => {
      const scrollPath = activeRestorePath.current;
      if (!scrollPath || !(scrollPath in scrollCache.current)) {
        window.scrollTo(0, 0);
        return;
      }

      activeRestorePath.current = undefined;
      const [scrollX, scrollY] = scrollCache.current[scrollPath];
      window.scrollTo(scrollX, scrollY);
      // sometimes rendering the page can take a bit longer
      const delays = [10, 20, 40, 80, 160];
      const checkAndScroll = () => {
        if (
          (window.scrollX === scrollX && window.scrollY === scrollY) ||
          scrollPath !== getCurrentPath()
        ) {
          return;
        }
        window.scrollTo(scrollX, scrollY);
        const delay = delays.shift();
        if (delay) {
          setTimeout(checkAndScroll, delay);
        }
      };
      setTimeout(checkAndScroll, delays.shift());
    };
    const onScroll = () => {
      scrollCache.current[getCurrentPath()] = [window.scrollX, window.scrollY];
    };
    router.events.on("routeChangeComplete", onComplete);
    window.addEventListener("scroll", onScroll);
    return () => {
      router.events.off("routeChangeComplete", onComplete);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const useSaleorAuthClientProps = useSaleorAuthClient({
    saleorApiUrl: API_URI,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  });

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const { saleorAuthClient } = useSaleorAuthClientProps;

  const { apolloClient, reset, refetch } = useAuthenticatedApolloClient({
    fetchWithAuth: saleorAuthClient.fetchWithAuth,
    uri: API_URI,
    typePolicies,
  });

  useAuthChange({
    onSignedOut: () => reset(),
    onSignedIn: () => refetch(),
  });

  if (
    process.env.NEXT_PUBLIC_SHOP_UNDER_CONSTRUCTION === "true" &&
    (process.env.NEXT_PUBLIC_STOREFRONT_NAME === "FASHION4YOU" ||
      process.env.NEXT_PUBLIC_STOREFRONT_NAME === "CLOTHES4U")
  ) {
    return <UnderConstruction />;
  } else {
    return (
      <SaleorAuthProvider {...useSaleorAuthClientProps}>
        <ApolloProvider client={apolloClient}>
          <CheckoutProvider>
            <RegionsProvider>
              <WishlistProvider>
                <BaseSeo />
                <NextNProgress color="#fff" options={{ showSpinner: false }} />
                {DEMO_MODE && <DemoBanner />}
                {getLayout(<Component {...pageProps} />)}
                <CookieBanner />
              </WishlistProvider>
            </RegionsProvider>
          </CheckoutProvider>
        </ApolloProvider>
      </SaleorAuthProvider>
    );
  }
}

export default MyApp;
