import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	return (
		<div className="overflow-hidden rounded-md border bg-slate-50">
			<NextImage
				{...props}
				className="h-full w-full object-cover object-center p-4"
			/>
		</div>
	);
};
