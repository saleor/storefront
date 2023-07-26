import { Carousel } from "@mantine/carousel";
import ProductCarouselItem from "./ProductCarouselItem";
import { ProductDetailsFragment } from "@/saleor/api";
import { useIntl } from "react-intl";
import { messages } from "../translations";

interface ProductsFeaturedProps {
  products: ProductDetailsFragment[];
}

const ProductsFeatured = ({ products }: ProductsFeaturedProps) => {
  const t = useIntl();
  return (
    <>
      {products?.length ? (
        <>
          <div className="mt-64 text-center">
            <h2 className="text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl">
              {t.formatMessage(messages.featuredProducts)}
            </h2>
            <p className="max-w-[778px] text-center mx-auto mt-4 text-md sm:text-md md:text-md lg:text-md text-main-1 mb-12 sm:mb-16 md:mb-24 leading-relaxed">
              {t.formatMessage(messages.featuredProductsText)}
            </p>
          </div>
          <Carousel
            className="mt-8"
            withIndicators
            height={750}
            slideSize="33.333333%"
            slideGap="md"
            loop
            align="start"
            breakpoints={[
              { maxWidth: "md", slideSize: "75%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
            ]}
          >
            {products.map((product) => (
              <Carousel.Slide key={product.id}>
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
