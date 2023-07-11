import usePaths from "@/lib/paths";
import { PhotographIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";

const ProductCarouselItem: React.FC<ProductListItemProps> = ({ product }) => {
  const paths = usePaths();
  const { category } = product;
  const thumbnailUrl = product.media?.find((media) => media.type === "IMAGE")?.url;

  return (
    <li key={product.id} className="w-full list-none hover: cursor-pointer">
      <Link
        href={paths.products._slug(product.slug).$url()}
        prefetch={false}
        passHref
        legacyBehavior
      >
        <div className="text-center md:flex md:justify-center md:flex-col md:items-center">
          <div className="flex h-[350px] md:h-[210px]">
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} width={512} height={512} />
            ) : (
              <div className="grid place-items-center h-full w-full">
                <PhotographIcon className="h-10 w-10" />
              </div>
            )}{" "}
          </div>
          <p className="bg-[#f4f4f4] text-[#c1c1c1] py-2 px-4 text-center mt-2 w-max">
            {category?.name}
          </p>
          <h4 className="mt-8 mb-2 text-center capitalize text-md font-normal text-main underline">
            {product.name}
          </h4>
        </div>
      </Link>
    </li>
  );
};

export default ProductCarouselItem;
