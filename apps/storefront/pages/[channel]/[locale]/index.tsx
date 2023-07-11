import { GetStaticPaths, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";
import Image from "next/image";

import { Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { useShopInformation } from "@/lib/hooks/useShopInformation";
import DefaultHeroWomanImg from "../../../images/homepage/hero-img.jpg";
import DefaultHeroImgC4U from "../../../images/homepage/hero-img-default-c4u.jpg";
import { useFeaturedProducts } from "@/lib/hooks/useFeaturedProducts";

const DefaultHero =
  STOREFRONT_NAME === "FASHION4YOU" ? DefaultHeroWomanImg.src : DefaultHeroImgC4U.src;

import { rootCategoryPaths } from "@/lib/ssr/category";

import WomanCategory from "../../../images/homepage/woman-category.jpg";
import ManCategory from "../../../images/homepage/man-category.jpg";
import KidCategory from "../../../images/homepage/kid-category.jpg";
import Link from "next/link";
import { STOREFRONT_NAME } from "@/lib/const";
import messages from "@/components/translations";
import { useIntl } from "react-intl";
import { AdvantagesBlock } from "@/components/AdvantagesBlock";
import ProductsFeatured from "@/components/ProductsFeatured/ProductsFeatured";

export const WomanCategoryImg = WomanCategory;

export const KidCategoryImg = KidCategory;

export const ManCategoryImg = ManCategory;

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

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>;

const Home: React.FC<HomeProps> = ({ categories }) => {
  const { featuredProducts } = useFeaturedProducts();
  const { shop } = useShopInformation();
  const t = useIntl();

  const categoriesExist = () => {
    return categories.length > 0;
  };

  const visibleCategory =
    STOREFRONT_NAME === "FASHION4YOU" ? categories.slice(0, -2) : categories.slice(0, -2);

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
            <AdvantagesBlock />
            {categoriesExist() && (
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
                    {visibleCategory.map((category) => {
                      return (
                        <div
                          key={category.slug}
                          className="relative text-center flex flex-col items-center justify-center mt-0 gap-x-1.5 gap-y-1.5"
                        >
                          <div className="home-page__categories__text-image">
                            {category.slug === "kobieta" ? (
                              <Image
                                src={WomanCategoryImg}
                                alt="1"
                                className="object-cover w-full h-auto"
                              />
                            ) : category.slug === "mezczyzna" ? (
                              <Image
                                src={ManCategoryImg}
                                alt="1"
                                className="object-cover w-full h-auto"
                              />
                            ) : (
                              category.slug === "dziecko" && (
                                <Image
                                  src={KidCategoryImg}
                                  alt="1"
                                  className="object-cover w-full h-auto"
                                />
                              )
                            )}
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
