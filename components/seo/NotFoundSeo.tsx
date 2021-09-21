import { NextSeo } from "next-seo";

export const NotFoundSeo: React.VFC = () => {
  const title = `Not found - Saleor Tutorial`;
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
            url: "/saleor.svg",
            alt: "Saleor logo",
          },
        ],
        site_name: "Saleor Tutorial",
      }}
    />
  );
};

export default NotFoundSeo;
