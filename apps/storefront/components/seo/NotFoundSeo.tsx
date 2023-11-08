import { NextSeo } from "next-seo";

import { STOREFRONT_NAME } from "@/lib/const";
import { ogImageUrl } from "./utils";

export function NotFoundSeo() {
  const title = `Page Not found - ${STOREFRONT_NAME}`;
  const description = "Page not found.";

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        images: [
          {
            url: ogImageUrl,
            alt: description,
          },
        ],
        site_name: title,
      }}
    />
  );
}

export default NotFoundSeo;
