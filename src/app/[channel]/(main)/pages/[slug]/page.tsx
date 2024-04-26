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

	function imageParser(block: BlockType) {
		// todo: need to review this
		const imgSrc = page?.media?.find((media: { url: string }): boolean => {
			const blockUrl = block.data.file.url;
			const blockFilename = blockUrl.substring(
				blockUrl.lastIndexOf("/") + 1,
				blockUrl.includes("?") ? blockUrl.indexOf("?") : blockUrl.length,
			);
			const mediaFilename = media.url.substring(
				media.url.lastIndexOf("/") + 1,
				media.url.includes("?") ? media.url.indexOf("?") : media.url.length,
			);
			return blockFilename === mediaFilename;
		});
		if (imgSrc) {
			return `<img src=${imgSrc.url} alt="" />`;
		} else {
			return ``;
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
