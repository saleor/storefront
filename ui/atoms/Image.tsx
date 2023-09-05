import NextImage from "next/image";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export const Image = ({ src, alt, width = 256, height = 256}: Props) => {
  return (
    <div className="overflow-hidden rounded-md bg-slate-50 border hover:border-slate-500">
      <NextImage
        width={width}
        height={height}
        alt={alt}
        src={src}
        className="object-cover object-center h-full w-full p-4 hover:scale-110 transition-transform"
      />
    </div>
  )
}