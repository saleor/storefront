import NextImage from "next/image";

type Props = {
	src: string;
	alt: string;
	width: number;
	height: number;
};

export const Image = ({ src, alt, width, height }: Props) => {
	return (
		<div className="overflow-hidden rounded-md border bg-slate-50 hover:border-slate-500">
			<NextImage
				width={width}
				height={height}
				alt={alt}
				src={src}
				className="h-full w-full object-cover object-center p-4 transition-transform hover:scale-110"
			/>
		</div>
	);
};
