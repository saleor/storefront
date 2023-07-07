import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";

import { HomepageBlock, Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { HOMEPAGE_MENU, STOREFRONT_NAME } from "@/lib/const";
import { contextToRegionQuery } from "@/lib/regions";
import {
  HomepageBlocksQuery,
  HomepageBlocksQueryDocument,
  HomepageBlocksQueryVariables,
} from "@/saleor/api";
import { serverApolloClient } from "@/lib/ssr/common";
import { useFeaturedProducts } from "@/lib/hooks/useFeaturedProducts";

import DefaultHeroWomanImg from "../../../images/homepage/hero-img.jpg";
import DefaultHeroImgC4U from "../../../images/homepage/hero-img-default-c4u.jpg";
import { useShopInformation } from "@/lib/hooks/useShopInformation";

const DefaultHero =
  STOREFRONT_NAME === "FASHION4YOU" ? DefaultHeroWomanImg.src : DefaultHeroImgC4U.src;

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const result: ApolloQueryResult<HomepageBlocksQuery> = await serverApolloClient.query<
    HomepageBlocksQuery,
    HomepageBlocksQueryVariables
  >({
    query: HomepageBlocksQueryDocument,
    variables: { slug: HOMEPAGE_MENU, ...contextToRegionQuery(context) },
  });
  return {
    props: {
      menuData: result?.data,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};

function Home() {
  const { featuredProducts } = useFeaturedProducts();
  const { shop } = useShopInformation();

  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="container" />
          <div
            className="bg-black-overlay bg-blend-multiply bg-cover bg-center h-[77vh] flex justify-center items-center flex-col p-2 md:max-h-[87vh]"
            style={
              featuredProducts.backgroundImage
                ? // FIXME: There is a problem with uncorrect link to featuredProduct collection image.
                  //  {
                  //     backgroundImage: `url(${featuredProducts.backgroundImage.url})`,
                  //   }
                  {
                    backgroundImage: `url(${DefaultHero})`,
                  }
                : {
                    backgroundImage: `url(${DefaultHero})`,
                  }
            }
          >
            <div className="overflow-hidden mb-5 text-center">
              <div>
                <h1 className="font-bold text-white text-[48px] md:text-[30px] max-w-[647px] md:max-w-full">
                  Sklep {STOREFRONT_NAME}
                </h1>
              </div>
              <div>
                <p className="text-white text-[20px] md:text-[18px] max-w-[746px]">
                  {shop?.description}
                </p>
              </div>
            </div>
            <div className="w-full mt-8 md:mt-0 flex flex-row items-center justify-center md:justify-between gap-8 md:gap-1.2rem"></div>
          </div>
        </header>
        <main>
          <div className="container"></div>
        </main>
      </div>
    </>
  );
}

export default Home;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
