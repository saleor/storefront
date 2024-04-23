import NextImage, { type ImageProps } from "next/image";
import { executeGraphQL } from "@/lib/graphql";
import { PageGetBySlugDocument } from "@/gql/graphql";

export async function BackgroundImageWrapper(props: ImageProps) {
	// todo change location of background image
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: "home", size: 0 },
		revalidate: 60,
	});

	let imgSrc: string;
	if (!page || !page.media || page?.media.length == 0) {
		imgSrc = process.env.SITE_BACKGROUND ? process.env.SITE_BACKGROUND : "";
	} else {
		imgSrc = page?.media[0].url;
	}

	return (
		<NextImage
			{...props}
			src={imgSrc}
			alt="Background"
			unoptimized={true}
			fill={true}
			className="opacity-100"
		/>
	);
}
