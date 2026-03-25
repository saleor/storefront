import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executePublicGraphQL } from "@/lib/graphql";

const parser = edjsHTML();

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	const page = result.ok ? result.data.page : null;

	return {
		title: `${page?.seoTitle || page?.title || "Page"} | InfinityBio Labs`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const result = await executePublicGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!result.ok || !result.data.page) {
		notFound();
	}

	const page = result.data.page;

	const { title, content } = page;

	const contentHtml = content ? parser.parse(JSON.parse(content)) : null;

	return (
		<div className="min-h-[60vh] bg-neutral-950">
			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<h1 className="text-3xl font-bold text-white">{title}</h1>
				{contentHtml && (
					<div className="prose prose-invert mt-8 prose-headings:text-white prose-p:text-neutral-300 prose-a:text-emerald-400 prose-strong:text-white prose-li:text-neutral-300">
						{contentHtml.map((content) => (
							<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
