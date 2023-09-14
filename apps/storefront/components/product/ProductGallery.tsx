import { PlayIcon } from "@heroicons/react/outline";
import Image from "next/legacy/image";
import { useState } from "react";
import { Carousel } from "@mantine/carousel";

import { getGalleryMedia, getVideoThumbnail } from "@/lib/media";
import {
  ProductDetailsFragment,
  ProductMediaFragment,
  ProductVariantDetailsFragment,
} from "@/saleor/api";
import VideoExpand from "./VideoExpand";

export interface ProductGalleryProps {
  product: ProductDetailsFragment;
  selectedVariant?: ProductVariantDetailsFragment;
}

export function ProductGallery({ product, selectedVariant }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoToPlay, setVideoToPlay] = useState<ProductMediaFragment | undefined>(undefined);

  const galleryMedia = getGalleryMedia({ product, selectedVariant });

  return (
    <>
      <div
        className="mt-1 mb-2 w-full overflow-scroll scrollbar-hide grid grid-cols-8 gap-4 lg:gap-8"
        style={{
          scrollSnapType: "both mandatory",
        }}
      >
        {galleryMedia?.length > 1 && (
          <div className="hidden sm:grid md:grid-cols-1 grid-cols-1 gap-4 h-full col-span-2">
            <Carousel
              orientation="vertical"
              height="100%"
              withIndicators
              slideSize="25%"
              slideGap="xl"
              styles={{
                control: {
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
              }}
              align="start"
              slidesToScroll={4}
            >
              {galleryMedia.map((media: ProductMediaFragment, index: number) => (
                <Carousel.Slide>
                  {/* <div key={media.url} className="relative h-24 w-full"> */}
                  <div key={media.url} className="">
                    {media.type === "IMAGE" ? (
                      <Image
                        className={`h-auto rounded-lg ${
                          index === currentImageIndex ? "!border-solid !border-4 !border-brand" : ""
                        }`}
                        onClick={() => {
                          setCurrentImageIndex(index);
                        }}
                        src={media.url}
                        alt={media.alt}
                        role="button"
                        tabIndex={index - 2}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : getVideoThumbnail(media.url) ? (
                      <Image
                        className="h-auto max-w-full rounded-lg"
                        onClick={() => setCurrentImageIndex(index)}
                        src={getVideoThumbnail(media.url) || ""}
                        alt={media.alt}
                        role="button"
                        tabIndex={index - 2}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : null}
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        )}

        {galleryMedia?.length > 0 && (
          <div className="col-span-8 sm:col-span-6">
            <div className="relative w-full hidden sm:flex" style={{ height: "100vh" }}>
              {galleryMedia[currentImageIndex].type === "IMAGE" && (
                <Image
                  className="rounded-lg"
                  // onClick={() => setCurrentImageIndex(0)}
                  src={galleryMedia[currentImageIndex].url}
                  alt={galleryMedia[currentImageIndex].alt}
                  // role="button"
                  tabIndex={-2}
                  layout="fill"
                  objectFit="cover"
                />
              )}
              {galleryMedia[currentImageIndex].type === "VIDEO" && (
                <div
                  role="button"
                  tabIndex={-2}
                  onClick={() => {
                    setVideoToPlay(galleryMedia[currentImageIndex]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setVideoToPlay(galleryMedia[currentImageIndex]);
                    }
                  }}
                >
                  {getVideoThumbnail(galleryMedia[currentImageIndex].url) && (
                    <Image
                      src={getVideoThumbnail(galleryMedia[currentImageIndex].url) || ""}
                      alt={galleryMedia[currentImageIndex].alt}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  )}
                  <div className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 absolute w-full h-full flex justify-center items-center bg-transparent">
                    <PlayIcon className="h-12 w-12" />
                  </div>
                </div>
              )}
            </div>
            <div className="sm:hidden w-full">
              <Carousel
                mx="auto"
                withIndicators
                height="100%"
                slideGap="md"
                align="start"
                styles={{
                  indicator: {
                    backgroundColor: "white !important",
                  },
                }}
              >
                {galleryMedia.map((media: ProductMediaFragment, index: number) => (
                  <Carousel.Slide>
                    {/* <div key={media.url} className="relative h-24 w-full"> */}
                    <div key={media.url} className="h-[500px]">
                      {media.type === "IMAGE" ? (
                        <Image
                          className={`h-auto`}
                          src={media.url}
                          alt={media.alt}
                          tabIndex={index - 2}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : getVideoThumbnail(media.url) ? (
                        <Image
                          className="h-auto max-w-full rounded-lg"
                          onClick={() => setCurrentImageIndex(index)}
                          src={getVideoThumbnail(media.url) || ""}
                          alt={media.alt}
                          role="button"
                          tabIndex={index - 2}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : null}
                    </div>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </div>
          </div>
        )}
      </div>

      {videoToPlay && (
        <div className="absolute min-h-screen min-w-screen top-0 bottom-0 left-0 right-0 z-40">
          <VideoExpand video={videoToPlay} onRemoveExpand={() => setVideoToPlay(undefined)} />
        </div>
      )}
    </>
  );
}
