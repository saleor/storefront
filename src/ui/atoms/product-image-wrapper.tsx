import NextImage, { type ImageProps } from "next/image";
import clsx from "clsx";

interface ProductImageWrapperProps extends ImageProps {
	containerClassName?: string;
}

export const ProductImageWrapper = ({
	containerClassName,
	className,
	fill = true,
	...props
}: ProductImageWrapperProps) => {
	return (
		<div className={clsx("relative aspect-square overflow-hidden bg-secondary", containerClassName)}>
			<NextImage
				{...props}
				fill={fill}
				className={clsx(
					fill ? "object-cover object-center" : "h-full w-full object-cover object-center",
					className,
				)}
			/>
		</div>
	);
};
