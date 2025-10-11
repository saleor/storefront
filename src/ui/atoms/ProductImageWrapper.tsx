import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	const { priority = false, loading = "lazy", ...restProps } = props;

	return (
		<div className="relative aspect-square overflow-hidden bg-base-900">
			<NextImage
				{...restProps}
				priority={priority}
				loading={priority ? undefined : loading}
				className="h-full w-full object-contain object-center p-4 transition-transform duration-300 hover:scale-105"
				quality={85}
				placeholder="blur"
				blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
				sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
			/>
		</div>
	);
};
