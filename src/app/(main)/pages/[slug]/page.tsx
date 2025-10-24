import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { parseEditorJsToHTML } from "@/lib/editorjs/parser";
import { EditorJsContent } from "@/ui/components/EditorJsContent";

export const generateMetadata = async (props: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	return {
		title: `${page?.seoTitle || page?.title || "Page"} · Saleor Storefront example`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

export default async function Page(props: { params: Promise<{ slug: string }> }) {
	const params = await props.params;
	const { page } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: params.slug },
		revalidate: 60,
	});

	if (!page) {
		notFound();
	}

	const { title, content } = page;

	const contentHtml = content ? parseEditorJsToHTML(content) : null;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="text-3xl font-semibold">{title}</h1>
			{contentHtml && (
				<div className="prose">
					{contentHtml.map((content, index) => (
						<EditorJsContent key={index} html={content} />
					))}
				</div>
			)}
		</div>
	);
}
