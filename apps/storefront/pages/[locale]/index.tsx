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

import DefaultHeroWomanImg from "../../images/homepage/f4u_hero_banner.webp";
import DefaultHeroImgC4U from "../../images/homepage/c4u_hero_banner.webp";
import WomanCategory from "../../images/homepage/woman-category.webp";
import ManCategory from "../../images/homepage/man-category.webp";
import KidCategory from "../../images/homepage/kid-category.webp";
import usePaths from "@/lib/paths";
import { InferGetStaticPropsType } from "next";
import { getNewsData, getNewsIdData } from "@/lib/getNews";
import { getCollectionsData } from "@/lib/getCollections";
import { getFeaturedProducts } from "@/lib/getFeaturedProducts";
import { getCategoriesData } from "@/lib/getCategories";

import { getSales } from "@/lib/getSales";

const DEFAULT_HERO =
  STOREFRONT_NAME === "FASHION4YOU" ? DefaultHeroWomanImg.src : DefaultHeroImgC4U.src;

const CATEGORY_IMAGES = {
  kobieta: WomanCategory,
  mezczyzna: ManCategory,
  dziecko: KidCategory,
};

export const getStaticProps = async () => {
  const [newsIdResult, collectionsResult, categoriesResult, featuredProductsResult, salesResult] =
    await Promise.allSettled([
      getNewsIdData(),
      getCollectionsData(),
      getCategoriesData(),
      getFeaturedProducts(),
      getSales(),
    ]);

  const newsIdData = newsIdResult.status === "fulfilled" ? newsIdResult.value : null;
  const salesData = salesResult.status === "fulfilled" ? salesResult.value : null;
  const collectionsData = collectionsResult.status === "fulfilled" ? collectionsResult.value : null;
  const categoriesData = categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const featuredProductsData =
    featuredProductsResult.status === "fulfilled" ? featuredProductsResult.value : null;

  const newsId = newsIdData?.data?.pageTypes?.edges[0]?.node?.id;

  const newsData = newsId ? await getNewsData(newsId) : null;

  return {
    props: {
      featuredProducts: featuredProductsData,
      news: newsData?.data?.pages?.edges || null,
      sales: salesData?.data?.externalSales?.edges || null,
      categories: categoriesData?.data?.categories || null,
      collections: collectionsData?.data.collections || null,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};

function Home({
  featuredProducts,
  news,
  categories,
  collections,
  sales,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const paths = usePaths();
  const t = useIntl();

  const rootCategories = categories?.edges
    ? categories.edges
        .filter((edge: any) => edge.node.ancestors?.edges.length === 0)
        .map((edge: any) => edge.node)
    : [];

  const hasCategories = rootCategories?.length > 0;
  const hasCollections = collections && collections.edges && collections.edges.length > 0;

  const visibleCategories =
    STOREFRONT_NAME === "FASHION4YOU" ? rootCategories?.slice(0, -2) : rootCategories?.slice(0, -2);

  const renderCategoryImage = (slug: string) => {
    const ImageSrc = CATEGORY_IMAGES[slug as keyof typeof CATEGORY_IMAGES];
    return (
      <Image
        src={ImageSrc}
        alt={slug}
        loading="lazy"
        className="object-cover w-full h-auto brightness-75 rounded-2xl"
      />
    );
  };

  return (
    <>
      <BaseSeo />
      <div className="pb-10">
        <main>
          <div
            className="bg-black-overlay bg-cover bg-center h-[77vh] flex justify-center items-center flex-col p-2 md:max-h-[87vh] py-24 px-6 text-center dark:bg-neutral-500 bg-blend-multiply bg-neutral-400 lg:mx-16"
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
                <h1 className="mb-4 font-bold text-indexBanner text-5xl md:text-6xl xl:text-7xl tracking-tight max-w-[647px] md:max-w-full">
                  {t.formatMessage(messages.shop)} {STOREFRONT_NAME}
                </h1>
              </div>
              <div>
                <p className="text-indexBanner text-base md:text-lg max-w-[846px]">
                  {t.formatMessage(messages.shopDescription)}
                </p>
              </div>
            </div>
            <div className="w-full mt-8 md:mt-0 flex flex-column md:flex-row lg:flex-row xl:flex-row items-center flex-wrap justify-center md:justify-center gap-4 md:gap-2 lg:gap-2 xl:gap-2">
              <a
                href="#news"
                className="bg-primary py-2 px-6 text-white cursor-pointer hover:bg-brand hover:text-white rounded-full font-medium uppercase xs:text-sm transition duration-150 ease-in-out hover:bg-primary-600 focus:bg-primary-600 focus:outline-none focus:ring-0 border-2 border-brand text-[9px]"
              >
                {t.formatMessage(messages.news)}
              </a>
              <a
                href="#sales"
                className="bg-brand py-2 px-6 cursor-pointer hover:bg-brand hover:bg-opacity-60 hover:text-white text-white rounded-full font-medium uppercase xs:text-sm transition duration-150 ease-in-out hover:bg-primary-600 border-2 border-brand focus:bg-primary-600 focus:outline-none focus:ring-0 text-[9px]"
              >
                {t.formatMessage(messages.salesButton)}
              </a>
            </div>
          </div>
          {hasCategories && (
            <section className="mt-32 lg:mx-16">
              <div className="flex flex-col items-center py-6 container">
                <h2 className="max-w-[893px] text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
                  {t.formatMessage(messages.categories)}
                </h2>
                <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
                  {t.formatMessage(messages.categoriesText)}
                </p>
              </div>
              <div className="container px-4 sm:px-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-8">
                  {visibleCategories.map((category: any) => {
                    return (
                      <div
                        key={category.id}
                        className="relative text-center flex flex-col items-center justify-center mt-0 gap-x-1.5 gap-y-1.5"
                      >
                        <div className="w-full">
                          {renderCategoryImage(category.slug as string)}
                          <div className="absolute top-1/2 left-1/2 flex items-center transform -translate-x-1/2 -translate-y-1/2">
                            <Link
                              href={paths.category._slug(category?.slug as string).$url()}
                              className="whitespace-nowrap text-center bg-none px-10 text-4xl text-white  border-2 rounded-lg inline-block sm:text-3xl sm:px-6 lg:text-4xl lg:px-8 transition duration-500 hover:scale-125"
                              style={{
                                lineHeight: "5rem",
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
          {sales && sales.length > 0 && (
            <div id="sales" className="mt-32 lg:mx-16">
              <div className="flex flex-col items-center py-6 container">
                <h2 className="max-w-[893px] text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
                  {t.formatMessage(messages.sales)}
                </h2>
                <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
                  {t.formatMessage(messages.salesText)}
                </p>
              </div>
              <div className="container sm:grid sm:grid-cols-1 sm:gap-6 md:grid md:grid-cols-2 md:gap-6 md:items-center md:justify-center md:flex-wrap xl:flex xl:flex-row xl:gap-12 xl:items-center xl:justify-center xl:flex-wrap">
                {sales?.map(({ node: sale }) => {
                  const totalCount = sale?.products?.totalCount;

                  if (totalCount !== undefined && totalCount !== null && totalCount > 0) {
                    return (
                      <Link
                        href={paths.sale._id(sale?.id).$url()}
                        key={sale.id}
                        className="font-medium text-center flex sm:w-full xl:w-1/4 text-white p-4 transition-all duration-300 ease-in-out border-3 border-primary flex-col bg-brand gap-6 items-center justify-center rounded-lg flex-none border-2 border-brand hover:text-brand hover:border-2 hover:bg-transparent hover:border-brand"
                      >
                        {sale.name.match(/\d/) ? (
                          <span className="flex flex-col items-center justify-center">
                            <h3 className="text-[24px]">-{sale.name}%</h3>
                          </span>
                        ) : (
                          <span className="flex flex-col items-center justify-center">
                            <h3 className="text-[24px]">{sale.name}</h3>
                          </span>
                        )}
                      </Link>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
          {hasCollections && (
            <div className="mt-32 lg:mx-16">
              <div className="container px-0">
                <div className="flex flex-col items-center my-auto pb-4">
                  <h2 className="max-w-[893px] text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
                    {t.formatMessage(messages.collections)}
                  </h2>
                  <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
                    {t.formatMessage(messages.collectionsText)}
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
                              className="max-h-full w-600px max-w-full align-middle transition-all duration-500 ease-in-out bg-no-repeat px-40 py-80 lg:w-full hover:brightness-[45%] w-full h-80 object-cover rounded-2xl bg-auto bg-center xs:bg-cover xs:bg-left"
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
                            <h3 className="text-xl bg-white py-8 font-semibold mr-auto left-0 leading-10 break-words absolute bottom-14 pl-8 pr-8 capitalize">
                              {collection.name}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {news && news.length > 0 && (
            <div className="pt-48 lg:mx-16" id="news">
              <div className="container flex flex-col items-center justify-center mx-auto">
                <h2 className="max-w-[893px] text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
                  {t.formatMessage(messages.latestArticles)}
                </h2>
                <p className="text-md sm:text-md md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed max-w-[568px]">
                  {t.formatMessage(messages.latestArticlesText)}
                </p>
              </div>
              <div className="container w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 items-start justify-center gap-10 mb-16 md:flex-row md:items-start md:justify-center md:gap-10 xl:p-0 m-auto">
                {news?.map(({ node: newsElem }: any) => {
                  const url = (newsElem?.attributes[0]?.values[0]?.file?.url as string).split("/");
                  const correctedUrl = `${AWS_MEDIA_BUCKET}/${url[url.length - 2]}/${
                    url[url.length - 1]
                  }`;

                  let contentStringify = "";
                  if (newsElem?.content) {
                    try {
                      const parsedContent = JSON.parse(newsElem.content as string);
                      contentStringify = parsedContent.blocks[0]?.data?.text ?? "";
                    } catch (error) {
                      console.error("Error parsing content:", error);
                    }
                  }

                  return (
                    <div key={newsElem?.id} className="flex flex-col gap-6 w-full">
                      <Image
                        src={correctedUrl}
                        alt=""
                        className="w-full h-80 object-cover rounded-2xl"
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

          <AdvantagesBlock />
        </main>
      </div>
    </>
  );
}

export default Home;

export async function getStaticPaths() {
  return {
    paths: [{ params: { locale: "pl-PL" } }, { params: { locale: "en-US" } }],
    fallback: false,
  };
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
