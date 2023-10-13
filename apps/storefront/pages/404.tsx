import Link from "next/link";
import React, { ReactElement } from "react";

import { NotFoundSeo } from "@/components/seo/NotFoundSeo";
import { usePaths } from "@/lib/paths";
import Image from "next/legacy/image";
import { env } from "process";

import pic404 from "../images/picture404base.png";
import template404 from "../images/picture404forTransform.png";
import { Layout } from "@/components";

const brands = {
  fashion4You: "FASHION4YOU",
  clothes4U: "CLOTHES4U",
};

function Custom404() {
  const paths = usePaths();

  let hueTransform = "";

  switch (env.NEXT_PUBLIC_STOREFRONT_NAME) {
    case brands.fashion4You:
      hueTransform = "fashion4YouHueTransform";
      break;
    case brands.clothes4U:
      hueTransform = "clothes4UHueTransform";
      break;
    default:
      hueTransform = "fashion4YouHueTransform";
  }

  return (
    <>
      <NotFoundSeo />
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline columns-2 sm:flex md:flex items-center container">
          <div className="md:w-1/2 mx-2">
            <header className="mb-4 font-bold text-5xl md:text-7xl">
              <div className="text-brand mb-4">Oops!</div>
              <div className="">Ta strona nie istnieje lub została przeniesiona</div>
            </header>
            <div className="text-3xl md:text-4xl my-2">
              Być może błędnie wpisałeś adres strony lub ona nie istnieje.
            </div>
            <div className="my-12">
              <Link
                href={paths.$url()}
                className="text-2xl md:text-3xl border-brand border-2 bg-brand hover:border-brand hover:bg-white hover:text-brand transition
               text-white font-bold py-4 px-8 rounded-full"
              >
                Wróć na stronę główną
              </Link>
            </div>
          </div>
          <div className="relative md:w-1/2">
            <div>
              <Image src={pic404} alt="404" />
            </div>
            <div className={"absolute top-0 left-0 filter " + hueTransform}>
              <Image src={template404} alt="404" />
            </div>
          </div>
          <main></main>
        </div>
      </div>
    </>
  );
}

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Custom404;
