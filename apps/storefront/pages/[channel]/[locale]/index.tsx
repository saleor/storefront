import React, { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";

import { Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { AdvantagesBlock } from "@/components/AdvantagesBlock";
import ProductsFeatured from "@/components/ProductsFeatured/ProductsFeatured";
import { AWS_MEDIA_BUCKET, STOREFRONT_NAME } from "@/lib/const";
import messages from "@/components/translations";
import { useIntl } from "react-intl";

import DefaultHeroWomanImg from "../../../images/homepage/hero-img.jpg";
import DefaultHeroImgC4U from "../../../images/homepage/hero-img-default-c4u.jpg";
import WomanCategory from "../../../images/homepage/woman-category.jpg";
import ManCategory from "../../../images/homepage/man-category.jpg";
import KidCategory from "../../../images/homepage/kid-category.jpg";
import usePaths from "@/lib/paths";
import { GetStaticPaths, InferGetStaticPropsType } from "next";
import { getNewsData, getNewsIdData } from "@/lib/getNews";
import { getShopInfoData } from "@/lib/getShopInfo";
import { getCollectionsData } from "@/lib/getCollections";
import { getFeaturedProducts } from "@/lib/getFeaturedProducts";
import { getCategoriesData } from "@/lib/getCategories";

const DEFAULT_HERO =
  STOREFRONT_NAME === "FASHION4YOU" ? DefaultHeroWomanImg.src : DefaultHeroImgC4U.src;

const CATEGORY_IMAGES = {
  kobieta: WomanCategory,
  mezczyzna: ManCategory,
  dziecko: KidCategory,
};

export const getStaticProps = async () => {
  const [
    newsIdResult,
    shopInfoResult,
    collectionsResult,
    categoriesResult,
    featuredProductsResult,
  ] = await Promise.allSettled([
    getNewsIdData(),
    getShopInfoData(),
    getCollectionsData(),
    getCategoriesData(),
    getFeaturedProducts(),
  ]);

  const newsIdData = newsIdResult.status === "fulfilled" ? newsIdResult.value : null;
  const shopInfoData = shopInfoResult.status === "fulfilled" ? shopInfoResult.value : null;
  const collectionsData = collectionsResult.status === "fulfilled" ? collectionsResult.value : null;
  const categoriesData = categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const featuredProductsData =
    featuredProductsResult.status === "fulfilled" ? featuredProductsResult.value : null;

  const newsId = newsIdData?.data?.pageTypes?.edges[0]?.node?.id;

  const newsData = newsId ? await getNewsData(newsId) : null;

  return {
    props: {
      shop: shopInfoData?.data?.shop,
      featuredProducts: featuredProductsData,
      news: newsData?.data?.pages?.edges,
      categories: categoriesData?.data?.categories,
      collections: collectionsData?.data.collections,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};

function Home({
  shop,
  featuredProducts,
  news,
  categories,
  collections,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const paths = usePaths();

  const t = useIntl();

  const rootCategories = categories?.edges
    ? categories.edges
        .filter((edge: any) => edge.node.ancestors?.edges.length === 0)
        .map((edge: any) => edge.node)
    : [];

  const hasCategories = rootCategories?.length > 0;
  const hasNews = news?.length > 0;
  const hasCollections = collections && collections.edges && collections.edges.length > 0;

  const visibleCategories =
    STOREFRONT_NAME === "FASHION4YOU" ? rootCategories?.slice(0, -2) : rootCategories?.slice(0, -2);

  const renderCategoryImage = (slug: string) => {
    const ImageSrc = CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES];
    return (
      <Image src={ImageSrc} alt={slug} loading="lazy" className="object-cover w-full h-auto" />
    );
  };
  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <main>
          <div
            className="bg-black-overlay bg-blend-multiply bg-cover bg-center h-[77vh] flex justify-center items-center flex-col p-2 md:max-h-[87vh] bg-neutral-50 py-24 px-6 text-center dark:bg-neutral-500"
            style={
              featuredProducts?.backgroundImage
                ? {
                    backgroundImage: `url(${featuredProducts.backgroundImage?.url})`,
                  }
                : {
                    backgroundImage: `url(${DEFAULT_HERO})`,
                  }
            }
          >
            <div className="overflow-hidden mb-5">
              <div>
                <h1 className="mb-4 font-bold text-white text-5xl md:text-6xl xl:text-7xl tracking-tight max-w-[647px] md:max-w-full">
                  Sklep {STOREFRONT_NAME}
                </h1>
              </div>
              <div>
                <p className="text-white text-base md:text-lg max-w-[846px]">{shop?.description}</p>
              </div>
            </div>
            <div className="w-full mt-8 md:mt-0 flex flex-row items-center justify-center md:justify-center gap-2 md:gap-2">
              <a
                href="#news"
                className="bg-primary py-2 px-6 text-white cursor-pointer hover:bg-brand hover:text-white rounded font-medium uppercase text-sm transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 border-2 border-brand"
              >
                Aktualności
              </a>
              <a
                href="#sales"
                className="bg-brand py-2 px-6 cursor-pointer hover:bg-brand hover:bg-opacity-60 hover:text-white text-white rounded font-medium uppercase text-sm transition duration-150 ease-in-out hover:bg-primary-600 border-2 border-brand focus:bg-primary-600 focus:outline-none focus:ring-0"
              >
                Promocje
              </a>
            </div>
          </div>
          <div className="container">
            <AdvantagesBlock />
            {hasCategories && (
              <section className="mt-64">
                <div className="container px-4 sm:px-0">
                  <h2 className="text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl">
                    Szukasz konkretnych <span className="text-brand">produktów? </span> <br />
                    Nasze kategorie ułatwią Ci zadanie!
                  </h2>
                  <p className="mt-4 text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center lg:text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed">
                    {t.formatMessage(messages.categoriesHome)}
                  </p>
                </div>
                <div className="container px-4 sm:px-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {visibleCategories.map((category: any) => {
                      return (
                        <div
                          key={category.id}
                          className="relative text-center flex flex-col items-center justify-center mt-0 gap-x-1.5 gap-y-1.5"
                        >
                          <div className="home-page__categories__text-image w-full">
                            {renderCategoryImage(category.slug as string)}
                            <div className="absolute top-1/2 left-1/2 flex items-center transform -translate-x-1/2 -translate-y-1/2">
                              <Link
                                href={paths.category._slug(category?.slug as string).$url()}
                                className="whitespace-nowrap text-center bg-white text-black py-2 px-16 sm:py-6 sm:px-12 lg:py-4 lg:px-16 inline-block shadow-2xl text-2xl sm:text-3xl lg:text-4xl pt-0.3 transform hover:scale-110 transition-transform duration-300"
                                style={{
                                  boxShadow: "rgb(255, 255, 255) 0px -3.25em 0px 0px inset",
                                }}
                              >
                                {category.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
            <ProductsFeatured products={featuredProducts?.products} />
            {hasCollections && (
              <div className="mt-64">
                <div className="container">
                  <div className="flex flex-col items-center my-auto pb-4">
                    <h2 className="text-center font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl">
                      Nasze najnowsze trendy - zobacz popularne kolekcje
                    </h2>
                    <p className="mt-4 text-md sm:text-md md:text-md lg:text-md text-gray-700 text-left lg:text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[768px]">
                      Zobacz nasze bestsellery i podążaj za trendami! Nasze najnowsze trendy z
                      pewnością Cię zainspirują i pomogą znaleźć swój wyjątkowy styl.
                    </p>
                  </div>
                  <div className="flex flex-col px-8 justify-center mt-13 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-0">
                    {collections?.edges?.map(({ node: collection }: any) => {
                      return collection.name === "O nas" ? (
                        <></>
                      ) : (
                        <div
                          key={collection.id}
                          className="lg:w-full hover:cursor-pointer mb-8 lg:mb-0"
                        >
                          <Link
                            href={paths.collection._slug(collection?.slug as string).$url()}
                            key={collection.id}
                          >
                            <div className="relative bg-cover bg-center w-full flex flex-wrap items-center">
                              <div
                                className="h-auto max-h-full w-600px max-w-full align-middle transition-all duration-500 ease-in-out bg-cover bg-no-repeat object-cover px-40 py-80 rounded-lg lg:w-full hover:brightness-[45%]"
                                style={
                                  collection.backgroundImage
                                    ? {
                                        backgroundImage: `url(${
                                          collection.backgroundImage?.url as string
                                        })`,
                                      }
                                    : {
                                        backgroundImage: `url(${DEFAULT_HERO})`,
                                      }
                                }
                              />
                              <h4 className="text-xl bg-white py-8 font-semibold mr-auto left-0 leading-10 break-words absolute bottom-14 pl-8 pr-8 capitalize">
                                {collection.name}
                              </h4>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {hasNews && (
              <div className="container pt-32" id="news">
                <div className="flex flex-col items-center mx-auto">
                  <h2 className="text-left lg:text-center mt-4 font-semibold text-4xl sm:text-5xl md:text-5xl lg:text-5xl leading-tight">
                    Nowe artykuły i najnowsze informacje
                  </h2>
                  <p className="mt-4 text-md sm:text-md md:text-md lg:text-md text-gray-700 text-left lg:text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed">
                    Poznaj świat mody i stylu dzięki naszym najnowszym treściom i aktualizacjom
                  </p>
                </div>
                <div className="w-full flex flex-col items-start justify-center gap-10 mb-16 md:flex-row md:items-start md:justify-center md:gap-10">
                  {news?.slice(0, 3).map(({ node: newsElem }: any) => {
                    const url = (newsElem?.attributes[0]?.values[0]?.file?.url as string).split(
                      "/"
                    );
                    const correctedUrl = `${AWS_MEDIA_BUCKET}/${url[url.length - 2]}/${
                      url[url.length - 1]
                    }`;

                    const contentStringify = JSON.parse(
                      newsElem?.content as string
                    ).blocks[0].data.text.replace(/^(.{128}[^\s]*).*/, "$1");

                    return (
                      <div key={newsElem?.id} className="flex flex-col gap-6 w-full">
                        <Image
                          src={correctedUrl}
                          alt=""
                          className="w-full h-80 object-cover rounded-lg"
                          width={500}
                          height={500}
                          loading="lazy"
                        />
                        <Link
                          href={paths.page._slug(newsElem?.slug as string).$url()}
                          className="text-lg font-bold break-words w-full max-w-full transition-colors duration-400 ease-in-out hover:text-primary"
                        >
                          {newsElem?.title}
                        </Link>
                        <p className="text-base text-gray-700 break-words">
                          {contentStringify} [...]
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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
