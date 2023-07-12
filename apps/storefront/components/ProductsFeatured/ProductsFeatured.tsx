import { Carousel } from "@mantine/carousel";
import ProductCarouselItem from "./ProductCarouselItem";
import { ProductDetailsFragment } from "@/saleor/api";

interface ProductsFeaturedProps {
  products: ProductDetailsFragment[];
}

const ProductsFeatured = ({ products }: ProductsFeaturedProps) => {
  return (
    <>
      <div className="mt-24 text-center">
        <h2 className="text-center mb-4 font-semibold text-5xl sm:text-5xl md:text-5xl lg:text-6xl">
          Oto nasze <span className="text-brand">polecane produkty!</span>
        </h2>
        <p className="max-w-[778px] text-center mx-auto mt-4 text-md sm:text-md md:text-md lg:text-md text-gray-700 mb-12 sm:mb-16 md:mb-24 leading-relaxed">
          Nie masz czasu na przeglądanie setek produktów? Szukasz najlepszych propozycji, które
          pozwolą Ci zaoszczędzić czas i pieniądze? Nasze polecane produkty to gwarancja sukcesu!
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
  );
};

export default ProductsFeatured;
