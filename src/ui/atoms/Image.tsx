import clsx from "clsx";
import NextImage from "next/image";

type Props = {
	src: string;
	alt: string;
	width: number;
	height: number;
	square?: boolean;
	fit?: "object-contain" | "object-cover";
};

export const Image = ({ src, alt, width, height, square = true, fit = "object-cover" }: Props) => {
	return (
		<div className="overflow-hidden rounded-md border bg-slate-50 hover:border-slate-500">
			<NextImage
				width={width}
				height={height}
				alt={alt}
				src={src}
				className={clsx(
					"h-full w-full object-center p-4 transition-transform hover:scale-110",
					square && "aspect-square",
					fit,
				)}
			/>
		</div>
	);
};
