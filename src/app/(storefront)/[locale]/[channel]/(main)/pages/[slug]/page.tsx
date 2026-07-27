import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import edjsHTML from "editorjs-html";
import xss from "xss";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getPageData } from "@/lib/catalog/get-page-data";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { buildBrowsePageMetadata, resolveSeoDescription } from "@/lib/seo";
import { PageContentSkeleton } from "@/ui/components/page-content-skeleton";

const parser = edjsHTML();

export const generateMetadata = async (props: {
	params: Promise<{ slug: string; locale: string; channel: string }>;
}): Promise<Metadata> => {
	const params = await props.params;
	const page = await getPageData(params.slug, params.locale);

	return buildBrowsePageMetadata({
		title: page?.seoTitle || page?.title || "Page",
		description: page
			? resolveSeoDescription({
					seoDescription: page.seoDescription,
					body: page.content,
					fallbackName: page.title,
				})
			: undefined,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: page ? catalogPathSuffix("pages", page) : `/pages/${encodeURIComponent(params.slug)}`,
		pathSuffixByLocale: page ? buildCatalogPathSuffixByLocale("pages", buildLocaleSlugMap(page)) : undefined,
	});
};

/**
 * Sync page shell — CMS content streams inside a Suspense island (Cache Components / PPR).
 */
export default function Page(props: { params: Promise<{ slug: string; locale: string; channel: string }> }) {
	return (
		<Suspense fallback={<PageContentSkeleton />}>
			<PageContent params={props.params} />
		</Suspense>
	);
}

async function PageContent({
	params: paramsPromise,
}: {
	params: Promise<{ slug: string; locale: string; channel: string }>;
}) {
	const params = await paramsPromise;
	const page = await getPageData(params.slug, params.locale);

	if (!page) {
		notFound();
	}

	redirectToCanonicalCatalogSlug({
		locale: params.locale,
		channel: params.channel,
		urlSlug: params.slug,
		kind: "pages",
		entity: page,
	});

	const { title, content } = page;

	const contentHtml = content ? parser.parse(JSON.parse(content)) : null;

	return (
		<div className="container-content py-8 pb-16">
			<CatalogIdentityBridge kind="pages" primarySlug={page.slug} localeSlugs={buildLocaleSlugMap(page)} />
			<h1 className="mb-6 text-balance text-h1">{title}</h1>
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
