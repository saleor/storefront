import { XIcon } from "@heroicons/react/outline";
import Image from "next/image";
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
      <div
        role="button"
        tabIndex={0}
        className="absolute grid h-6 justify-end w-full z-40 p-8 lg:px-8 mx-auto"
        onClick={() => onRemoveExpand()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onRemoveExpand();
          }
        }}
      >
        <XIcon className="w-6 h-6" />
      </div>
      <div className="w-full h-full absolute md:mt-10">
        <Image src={image.url} alt={image.alt} layout="fill" objectFit="scale-down" />
      </div>
    </div>
  );
}

export default ImageExpand;
