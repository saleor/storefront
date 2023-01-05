import { XIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import React from "react";

import { ProductMediaFragment } from "@/saleor/api";

interface ImageExpandProps {
  image?: ProductMediaFragment;
  onRemoveExpand: () => void;
}
export function ImageExpand({ image, onRemoveExpand }: ImageExpandProps) {
  if (!image) {
    return null;
  }

  return (
    <div className="min-h-screen absolute overflow-hidden grid grid-cols-1 mx-auto px-8 md:h-full w-full bg-gray-100">
      <button
        type="button"
        className="absolute grid content-center justify-center right-0 p-8 h-6 w-6 z-40 mt-18"
        aria-label="Close"
        onClick={onRemoveExpand}
      >
        <XIcon className="w-6 h-6" />
      </button>
      <div className="w-full h-full absolute md:mt-10">
        <Image src={image.url} alt={image.alt} layout="fill" objectFit="scale-down" />
      </div>
    </div>
  );
}

export default ImageExpand;
