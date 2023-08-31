import { Carousel } from "@mantine/carousel";
import ProductCarouselItem from "./ProductCarouselItem";
import { useIntl } from "react-intl";
import { messages } from "../translations";
import { ProductDetailsFragment } from "@/saleor/api";

const ProductsFeatured = ({ products }: any) => {
  const t = useIntl();
  return (
    <>
      {products?.length ? (
        <>
          <div className="mt-64 text-center lg:mx-16">
            <h2 className="text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl">
              {t.formatMessage(messages.featuredProducts)}
            </h2>
            <p className="max-w-[778px] text-center mx-auto mt-4 text-md sm:text-md md:text-md lg:text-md text-main-1 mb-12 sm:mb-16 md:mb-24 leading-relaxed">
              {t.formatMessage(messages.featuredProductsText)}
            </p>
          </div>
          <Carousel
            className="mt-8 lg:mx-16"
            withIndicators
            height={700}
            slideSize="33.333333%"
            slideGap="md"
            loop
            align="start"
            breakpoints={[
              { maxWidth: "xs", slideSize: "100%" },
              { maxWidth: "md", slideSize: "33%" },
              { maxWidth: "sm", slideSize: "50%", slideGap: 0 },
            ]}
          >
            {products.map((product: ProductDetailsFragment) => (
              <Carousel.Slide key={product.id} className="list-none">
                <ProductCarouselItem product={product} />
              </Carousel.Slide>
            ))}
          </Carousel>
        </>
      ) : null}
    </>
  );
};

export default ProductsFeatured;
