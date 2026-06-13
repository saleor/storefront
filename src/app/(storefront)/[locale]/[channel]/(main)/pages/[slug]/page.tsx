import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { getPageData } from "@/lib/catalog/get-page-data";
import { PageContentSkeleton } from "@/ui/components/page-content-skeleton";

const parser = edjsHTML();

export const generateMetadata = async (props: {
	params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const page = await getPageData(params.slug, params.locale);

	return {
		title: `${page?.seoTitle || page?.title || "Page"} · Saleor Storefront example`,
		description: page?.seoDescription || page?.seoTitle || page?.title,
	};
};

/**
 * Sync page shell — CMS content streams inside a Suspense island (Cache Components / PPR).
 */
export default function Page(props: { params: Promise<{ slug: string; locale: string }> }) {
	return (
		<Suspense fallback={<PageContentSkeleton />}>
			<PageContent params={props.params} />
		</Suspense>
	);
}

async function PageContent({ params: paramsPromise }: { params: Promise<{ slug: string; locale: string }> }) {
	const params = await paramsPromise;
	const page = await getPageData(params.slug, params.locale);

	if (!page) {
		notFound();
	}

	const { title, content } = page;

	const contentHtml = content ? parser.parse(JSON.parse(content)) : null;

	return (
		<div className="mx-auto max-w-7xl p-8 pb-16">
			<h1 className="text-3xl font-semibold">{title}</h1>
			{contentHtml && (
				<div className="prose">
					{contentHtml.map((content) => (
						<div key={content} dangerouslySetInnerHTML={{ __html: xss(content) }} />
					))}
				</div>
			)}
		</div>
	);
}
