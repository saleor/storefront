import { Carousel } from "@mantine/carousel";
import ProductCarouselItem from "./ProductCarouselItem";
import { useIntl } from "react-intl";
import { messages } from "../translations";
import { ProductDetailsFragment } from "@/saleor/api";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline";

const ProductsFeatured = ({ products }: any) => {
  const t = useIntl();
  return (
    <div className="pt-16">
      {products?.length ? (
        <>
          <div className="text-center lg:mx-16">
            <h2 className="text-center mb-4 font-semibold text-4xl md:text-5xl lg:text-6xl leading-tight">
              {t.formatMessage(messages.featuredProducts)}
            </h2>
            <p className="text-base md:text-md lg:text-md text-gray-700 text-center mb-12 sm:mb-16 md:mb-24 leading-relaxed">
              {t.formatMessage(messages.featuredProductsText)}
            </p>
          </div>
          <Carousel
            className="container sm:px-2 md:px-24 lg:pl-80 lg:pr-60"
            withIndicators
            height={700}
            nextControlIcon={
              <ArrowRightIcon className="p-2 h-10 bg-brand border-solid rounded-lg text-white" />
            }
            previousControlIcon={
              <ArrowLeftIcon className="p-2 h-10 bg-brand border-solid rounded-lg text-white" />
            }
            slideSize="33.333333%"
            slideGap="xs"
            loop
            styles={{
              control: {
                "&[data-inactive]": {
                  opacity: 0,
                  cursor: "default",
                },
                marginTop: "-100px",
                marginRight: "20px",
                marginLeft: "20px",
              },
            }}
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
    </div>
  );
};

export default ProductsFeatured;
