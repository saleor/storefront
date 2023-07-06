import { GetStaticPaths, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";
import Image from "next/image";

import { Layout } from "@/components";
import { BaseSeo } from "@/components/seo/BaseSeo";
import { rootCategoryPaths } from "@/lib/ssr/category";

import WomanCategory from "../../../images/homepage/woman-category.jpg";
import ManCategory from "../../../images/homepage/man-category.jpg";
import KidCategory from "../../../images/homepage/kid-category.jpg";

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
  const categoriesExist = () => {
    return categories.length > 0;
  };

  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="container">
            {categoriesExist() && (
              <section className="home-page__categories">
                <div className="container home-page__categories-wrapper">
                  <h2 className="home-page__categories-wrapper-title">
                    Szukasz konkretnych <span>produktów?</span> Nasze kategorie ułatwią Ci zadanie!
                  </h2>
                  <p className="home-page__categories-wrapper-subtitle">
                    Nie wiesz, gdzie szukać swoich ulubionych produktów? Skorzystaj z naszych
                    przejrzystych kategorii i z łatwością znajdź to, czego szukasz.
                  </p>
                </div>
                <div className="container home-page__categories_container">
                  <div className="home-page__categories__list">
                    {categories.map((category) => {
                      return (
                        <div key={category.slug} className="home-page__category-item">
                          <div className="home-page__categories__text-image">
                            {category.slug === "apparel" ? (
                              <Image src={WomanCategoryImg} alt="1" />
                            ) : category.slug === "accessories" ? (
                              <Image src={ManCategoryImg} alt="1" />
                            ) : (
                              category.slug === "default-category" && (
                                <Image src={KidCategoryImg} alt="1" />
                              )
                            )}
                            <div className="home-page__categories-wrapper">
                              {/* <Link
                                href={generatePath(paths.category, {
                                  slug: category.slug,
                                })}
                                key={category.id}
                              >
                                <a className="home-page__categories__text-title">{category.name}</a>
                              </Link> */}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
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
