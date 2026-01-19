import NextImage, { type ImageProps } from "next/image";
import clsx from "clsx";

interface ProductImageWrapperProps extends ImageProps {
	containerClassName?: string;
}

export const ProductImageWrapper = ({
	containerClassName,
	className,
	...props
}: ProductImageWrapperProps) => {
	return (
		<div className={clsx("aspect-square overflow-hidden bg-secondary", containerClassName)}>
			<NextImage {...props} className={clsx("h-full w-full object-cover object-center", className)} />
		</div>
	);
};
