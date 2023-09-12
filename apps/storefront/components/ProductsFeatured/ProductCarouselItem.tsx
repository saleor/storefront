import usePaths from "@/lib/paths";
import { ProductDetailsFragment } from "@/saleor/api";
import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { useRegions } from "../RegionsProvider";

interface ProductCarouselItemProps {
  product: ProductDetailsFragment;
}

const ProductCarouselItem: React.FC<ProductCarouselItemProps> = ({ product }) => {
  const paths = usePaths();
  const thumbnailUrl = product.thumbnail?.url;
  const { formatPrice } = useRegions();

  const isOnSale = product.pricing?.onSale;
  const price = product.pricing?.priceRange?.start?.gross;
  const undiscountedPrice = product?.pricing?.priceRangeUndiscounted?.start?.gross;

  return (
    <li key={product.id} className="w-full">
      <Link
        href={paths.products._slug(product.slug).$url()}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <a href="pass">
          <div className="relative">
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} width={222} height={222} alt="" className="m-auto" />
            ) : (
              <div className="grid justify-items-center content-center h-full w-full">
                <PhotographIcon className="h-10 w-10 content-center" />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center text-center flex-col mt-8 mx-4">
            <p
              className="mt-2 font-regular text-md text-main first-letter:uppercase lowercase w-full md:w-auto"
              data-testid={`productName${product.name}`}
            >
              {product.name}
            </p>
            <div className="flex flex-row gap-3 items-center">
              <p
                className="block mt-4 text font-semibold text-md text-main uppercase"
                data-testid={`productName${product.name}`}
              >
                {formatPrice(price)}
              </p>
              {isOnSale && (
                <p className="block mt-4 text font-normal text-md uppercase line-through text-gray-400">
                  {formatPrice(undiscountedPrice)}
                </p>
              )}
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default ProductCarouselItem;
