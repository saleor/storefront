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
    <div className="absolute grid w-full min-h-screen grid-cols-1 px-8 mx-auto overflow-hidden bg-gray-100 md:h-full">
      <div className="absolute w-full h-full md:mt-10">
        <div
          role="button"
          tabIndex={0}
          className="absolute z-10 grid justify-end w-full h-6 p-8 mx-auto mt-14 lg:px-8 md:mt-4"
          onClick={() => onRemoveExpand()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onRemoveExpand();
            }
          }}
        >
          <XIcon className="w-6 h-6" />
        </div>
        <Image src={image.url} alt={image.alt} layout="fill" objectFit="scale-down" />
      </div>
    </div>
  );
}

export default ImageExpand;
