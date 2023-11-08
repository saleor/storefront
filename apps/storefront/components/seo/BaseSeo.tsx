import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import urlJoin from "url-join";

import { STOREFRONT_NAME, VERCEL_URL } from "@/lib/const";
export function BaseSeo() {
  const seoTitle = `Sklep ${STOREFRONT_NAME} z odzieżą używaną | Sklep internetowy`;
  const seoDescription =
    "Odkryj zróżnicowaną kolekcję ubrań używanych w naszym sklepie internetowym. Oferujemy wysokiej jakości odzież second hand, łącząc styl, wygodę i ekologiczne podejście.";

  const { asPath } = useRouter();

  const baseUrl = VERCEL_URL || "";
  const url = urlJoin(baseUrl, asPath);

  const ogImageUrl = urlJoin(baseUrl, "/api/og");

  return (
    <NextSeo
      title={seoTitle}
      description={seoDescription}
      openGraph={{
        title: seoTitle,
        description: seoDescription,
        images: [
          {
            url: ogImageUrl,
            alt: "OpenGraph image",
            width: 2048,
            height: 1170,
          },
        ],
        site_name: STOREFRONT_NAME,
        url,
      }}
    />
  );
}
