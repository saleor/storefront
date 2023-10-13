import React, { ReactElement } from "react";

import Image from "next/legacy/image";
import { env } from "process";

import pic404 from "../images/picture404base.png";
import template404 from "../images/picture404forTransform.png";
import { Layout } from "@/components";

const brands = {
  fashion4You: "FASHION4YOU",
  clothes4U: "CLOTHES4U",
};

function Custom500() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline columns-2 sm:flex md:flex items-center container">
          <div className="md:w-1/2 mx-2">
            <header className="mb-4 font-bold text-5xl md:text-7xl">
              <span className="text-brand mb-4">Oops!</span>
              <h1 className="">Cóż, to nieoczekiwane...</h1>
            </header>
            <p className="text-3xl md:text-4xl my-2">Kod błędu: 500</p>
            <p className="text-3xl md:text-4xl my-2">
              Wystąpił błąd i pracujemy nad jego usunięciem! Będziemy działać wkrótce.
            </p>
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

Custom500.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Custom500;
