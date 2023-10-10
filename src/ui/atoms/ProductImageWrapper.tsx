import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	return (
		<div className="overflow-hidden rounded-md border bg-slate-50 hover:border-slate-500">
			<NextImage
				{...props}
				className="h-full w-full object-cover object-center p-4 transition-transform hover:scale-110"
			/>
		</div>
	);
};
