import React, { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, InferGetStaticPropsType } from "next";

import { Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { AdvantagesBlock } from "@/components/AdvantagesBlock";
import ProductsFeatured from "@/components/ProductsFeatured/ProductsFeatured";
import { useShopInformation } from "@/lib/hooks/useShopInformation";
import { useFeaturedProducts } from "@/lib/hooks/useFeaturedProducts";
import { useCollections } from "@/lib/hooks/useCollections";
import { rootCategoryPaths } from "@/lib/ssr/category";
import { STOREFRONT_NAME } from "@/lib/const";
import messages from "@/components/translations";
import { useIntl } from "react-intl";

import DefaultHeroWomanImg from "../../../images/homepage/hero-img.jpg";
import DefaultHeroImgC4U from "../../../images/homepage/hero-img-default-c4u.jpg";
import WomanCategory from "../../../images/homepage/woman-category.jpg";
import ManCategory from "../../../images/homepage/man-category.jpg";
import KidCategory from "../../../images/homepage/kid-category.jpg";

const DEFAULT_HERO =
  STOREFRONT_NAME === "FASHION4YOU" ? DefaultHeroWomanImg.src : DefaultHeroImgC4U.src;

const CATEGORY_IMAGES = {
  kobieta: WomanCategory,
  mezczyzna: ManCategory,
  dziecko: KidCategory,
};

export const getStaticProps = async () => {
  const paths = await rootCategoryPaths();

  const categories = paths.map((path) => ({
    slug: path.params.slug,
  }));

  return {
    props: {
      categories,
    },
    revalidate: 60 * 60,
  };
};

const Home: React.FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ categories }) => {
  const { featuredProducts } = useFeaturedProducts();
  const { shop } = useShopInformation();
  const { collections } = useCollections();
  const t = useIntl();

  const hasCategories = categories.length > 0;
  const hasCollections = collections && collections.edges && collections.edges.length > 0;

  const visibleCategories =
    STOREFRONT_NAME === "FASHION4YOU" ? categories.slice(0, -2) : categories.slice(0, -2);

  const renderCategoryImage = (slug: string) => {
    const ImageSrc = CATEGORY_IMAGES[slug];
    return <Image src={ImageSrc} alt={slug} className="object-cover w-full h-auto" />;
  };

  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="container">
            <div
              className="bg-black-overlay bg-blend-multiply bg-cover bg-center h-[77vh] flex justify-center items-center flex-col p-2 md:max-h-[87vh]"
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
            <AdvantagesBlock />
            {hasCategories && (
              <section className="home-page__categories">
                <div className="container home-page__categories-wrapper px-4 sm:px-0">
                  <h2 className="text-left lg:text-center mt-4 font-semibold text-4xl sm:text-5xl md:text-5xl lg:text-5xl leading-tight">
                    Szukasz konkretnych <span className="text-brand">produktów? </span>
                    Nasze kategorie ułatwią Ci zadanie!
                  </h2>
                  <p className="mt-4 text-md sm:text-md md:text-md lg:text-md text-gray-700 text-left lg:text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed">
                    {t.formatMessage(messages.categoriesHome)}
                  </p>
                </div>
                <div className="container home-page__categories_container px-4 sm:px-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {visibleCategories.map((category) => {
                      return (
                        <div
                          key={category.slug}
                          className="relative text-center flex flex-col items-center justify-center mt-0 gap-x-1.5 gap-y-1.5"
                        >
                          <div className="home-page__categories__text-image">
                            {renderCategoryImage(category.slug)}
                            <div className="absolute top-1/2 left-1/2 flex items-center transform -translate-x-1/2 -translate-y-1/2">
                              <Link
                                href={category.slug}
                                className="whitespace-nowrap text-center bg-white text-black py-4 px-16 sm:py-6 sm:px-12 lg:py-8 lg:px-16 inline-block shadow-2xl text-2xl sm:text-3xl lg:text-4xl pt-0.3"
                                style={{
                                  boxShadow: "rgb(255, 255, 255) 0px -3.25em 0px 0px inset",
                                }}
                              >
                                {category.slug}
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
              <div className="mt-32">
                <div className="container">
                  <div className="flex flex-col items-center my-auto pb-4">
                    <h2 className="max-w-672px text-38px leading-42px font-bold text-black text-center mb-2 lg:max-w-none lg:text-34px">
                      Nasze najnowsze{" "}
                      <span className="text-primary text-38px leading-42px font-bold lg:text-34px">
                        trendy
                      </span>{" "}
                      - zobacz popularne kolekcje
                    </h2>
                    <p className="max-w-705px text-4e595a text-center">
                      Zobacz nasze bestsellery i podążaj za trendami! Nasze najnowsze trendy z
                      pewnością Cię zainspirują i pomogą znaleźć swój wyjątkowy styl.
                    </p>
                  </div>
                  <div className="flex flex-col px-8 justify-center mt-13 lg:grid lg:grid-cols-2 lg:gap-12 lg:px-0">
                    {collections?.edges?.map(({ node: collection }) => {
                      return collection.name === "O nas" ? (
                        <></>
                      ) : (
                        <div
                          key={collection.id}
                          className="lg:w-full hover:cursor-pointer mb-8 lg:mb-0"
                        >
                          <Link href="localhost:3000" key={collection.id}>
                            <div className="relative bg-cover bg-center w-full flex flex-wrap items-center">
                              <div
                                className="h-auto max-h-full w-600px max-w-full align-middle transition-all duration-500 ease-in-out bg-cover bg-no-repeat object-cover px-40 py-80 rounded-lg lg:w-full hover:brightness-[45%]"
                                style={
                                  collection.backgroundImage
                                    ? {
                                        backgroundImage: `url(${collection.backgroundImage?.url})`,
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
          </div>
        </header>
        <main>
          <div className="container"></div>
        </main>
      </div>
    </>
  );
};

export default Home;

export const getStaticPaths: GetStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
