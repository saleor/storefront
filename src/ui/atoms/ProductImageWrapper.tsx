import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	return (
		<div className="aspect-square overflow-hidden">
			<NextImage {...props} className="h-full w-full object-contain object-center p-2" />
		</div>
	);
};
