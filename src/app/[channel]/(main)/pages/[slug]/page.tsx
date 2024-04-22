import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

type BlockType = { id: string; data: { file: { url: string } }; type: string };

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => {
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug, size: 0 },
		revalidate: 60,
	});

	return {
		title: `${page?.seoTitle || page?.title || "Page"} · Saleor Storefront example`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

export default async function Page({ params }: { params: { slug: string } }) {
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug, size: 0 },
		revalidate: 60,
	});
	if (!page) {
		notFound();
	}

	const { title, content } = page;
	const pageContent: unknown = content ? JSON.parse(content) : [];

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
	const pageMedia = pageContent.blocks.filter((block: { type: string }) => {
		return block.type === "image";
	});

	function imageParser(block: BlockType) {
		// todo: need to review this
		const imgSrc = page?.media?.find((media: { url: string }): boolean => {
			const blockUrl = block.data.file.url;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
			const imgIndex = pageMedia
				.map((media: { data: { file: { url: any } } }) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return media.data.file.url;
				})
				.indexOf(blockUrl);

			const blockFilename = blockUrl.substring(
				blockUrl.lastIndexOf("/") + 1,
				blockUrl.includes("?") ? blockUrl.indexOf("?") : blockUrl.length,
			);
			const mediaFilename = media.url.substring(
				media.url.lastIndexOf("/") + 1,
				media.url.includes("?") ? media.url.indexOf("?") : media.url.length,
			);
			return blockFilename === mediaFilename && (page?.slug === "home" ? imgIndex > 0 : true);
		});
		if (imgSrc) {
			return `<img src=${imgSrc.url} alt="" />`;
		} else {
			return `<img src="" alt="" />`;
		}
	}
	// const pageType = page?.pageType.slug
	const parser = edjsHTML({ image: imageParser });

	const contentHtml = content ? parser.parse(JSON.parse(content)) : null;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="text-3xl font-semibold">{title}</h1>
			{contentHtml && (
				<div className="prose prose-invert text-neutral-200">
					{contentHtml.map((content) => (
						<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
					))}
				</div>
			)}
		</div>
	);
}
