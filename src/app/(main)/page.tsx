import { ProductListByCollectionDocument, PageGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";
import { DEFAULT_CHANNEL } from "@/app/config";
import { parseEditorJsToHTML } from "@/lib/editorjs/parser";
import { EditorJsContent } from "@/ui/components/EditorJsContent";

// export const experimental_ppr = true; // Requires Next.js canary - uncomment when upgrading

export const metadata = {
	title: "Home",
	description:
		"Professional guitar tones, cab impulse responses, and amp captures for musicians. High-quality IRs perfect for rock, metal, and all genres.",
};

export default async function Page() {
	// Fetch featured products
	const data = await executeGraphQL(ProductListByCollectionDocument, {
		variables: {
			slug: "featured",
			channel: DEFAULT_CHANNEL,
		},
		revalidate: 60,
		withAuth: false,
		tags: ["products", "featured"],
	});

	// Fetch news section
	const { page: newsPage } = await executeGraphQL(PageGetBySlugDocument, {
		variables: { slug: "news" },
		revalidate: 60,
	});

	const products = data.collection?.products?.edges.map(({ node: product }) => product);
	const newsContentHtml = newsPage?.content ? parseEditorJsToHTML(newsPage.content) : null;

	return (
		<>
			{/* Hero Section */}
			<section className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-12 lg:pb-24 lg:pt-32">
				<div className="animate-slide-up-fade space-y-6 text-center">
					<h1 className="font-display text-5xl font-light tracking-tight md:text-6xl lg:text-7xl">
						<span className="mb-2 block text-white">Sonic Drive Studio is all about the most </span>
						<span className="gradient-text block">professional guitar tones</span>
					</h1>
					<p className="mx-auto max-w-2xl text-xl font-light text-base-300 md:text-2xl">
						Curated collection of high-quality IRs and amp captures
					</p>
				</div>
			</section>

			{/* News Section */}
			{newsContentHtml && newsPage && (
				<section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
					<h2 className="mb-8 font-display text-3xl font-light text-white lg:mb-12">{newsPage.title}</h2>
					<div className="prose prose-invert max-w-none">
						{newsContentHtml.map((content, index) => (
							<EditorJsContent key={index} html={content} />
						))}
					</div>
				</section>
			)}

			{/* Featured Products Section */}
			{products && products.length > 0 && (
				<section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
					<h2 className="mb-8 font-display text-3xl font-light text-white lg:mb-12">Featured Products</h2>
					<ProductList products={products} />
				</section>
			)}
		</>
	);
}
