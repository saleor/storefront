import Image from "next/image";

interface ProductGalleryImageProps {
	src: string;
	alt: string;
	priority?: boolean;
}

/**
 * Server-rendered product image for LCP optimization.
 * This image is in the initial HTML, discoverable immediately by browsers.
 * The interactive gallery hydrates on top of this.
 */
export function ProductGalleryImage({ src, alt, priority = true }: ProductGalleryImageProps) {
	return (
		<Image
			src={src}
			alt={alt}
			fill
			className="object-cover"
			priority={priority}
			fetchPriority="high"
			sizes="(max-width: 768px) 100vw, 50vw"
		/>
	);
}
