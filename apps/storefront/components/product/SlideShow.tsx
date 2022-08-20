// eslint-disable-next-line import/no-extraneous-dependencies
import "react-slideshow-image/dist/styles.css";

import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Slide } from "react-slideshow-image";

import { getGalleryMedia } from "@/lib/media";
import { ProductDetailsFragment, ProductMediaFragment } from "@/saleor/api";

export interface SliderProps {
  product: ProductDetailsFragment;
}

export function Slider({ product }: SliderProps) {
  const galleryMedia = getGalleryMedia({ product });
  return (
    <Slide autoplay={false} transitionDuration={250}>
      {galleryMedia?.map((media: ProductMediaFragment) => (
        <div className="each-slide-effect" key={media.url}>
          {media.type === "IMAGE" && <div style={{ backgroundImage: `url(${media.url})` }} />}
        </div>
      ))}
    </Slide>
  );
}

export default Slider;
