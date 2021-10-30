import Image from "next/image";
import React from "react";

import { ProductMediaFragment } from "@/saleor/api";

interface ImageExpandProps {
  image?: ProductMediaFragment;
  onRemoveExpand: () => void;
}
export const ImageExpand = ({ image, onRemoveExpand }: ImageExpandProps) => {
  if (!image) {
    return null;
  }

  return (
    <div
      className={
        "min-h-screen absolute grid grid-cols-1 mx-auto px-8 md:h-full w-full bg-gray-100"
      }
    >
      <div
        className="absolute grid h-6 justify-end w-full z-40 p-8 lg:px-8 mx-auto"
        onClick={() => onRemoveExpand()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className="w-full h-full absolute md:mt-10">
        <Image
          src={image.url}
          alt={image.alt}
          layout="fill"
          objectFit="scale-down"
        />
      </div>
    </div>
  );
};
