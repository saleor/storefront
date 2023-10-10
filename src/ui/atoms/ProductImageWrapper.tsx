import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	return (
		<div className="overflow-hidden rounded-md border">
			<NextImage {...props} className="h-full w-full object-cover object-center p-2" />
		</div>
	);
};
