import NextImage, { type ImageProps } from "next/image";
import { clsx } from "clsx";

export interface ProductImageWrapperProps extends Omit<ImageProps, "className"> {
	className?: string;
	aspectRatio?: "square" | "portrait" | "landscape";
	objectFit?: "contain" | "cover";
}

export const ProductImageWrapper = ({ 
	className,
	aspectRatio = "square",
	objectFit = "contain",
	...props 
}: ProductImageWrapperProps) => {
	const aspectClasses = {
		square: "aspect-square",
		portrait: "aspect-[3/4]",
		landscape: "aspect-[4/3]",
	};

	const objectFitClasses = {
		contain: "object-contain",
		cover: "object-cover",
	};

	return (
		<div className={clsx(aspectClasses[aspectRatio], "overflow-hidden bg-secondary-50", className)}>
			<NextImage 
				{...props} 
				className={clsx(
					"h-full w-full object-center p-2 transition-transform duration-300",
					objectFitClasses[objectFit]
				)} 
			/>
		</div>
	);
};
