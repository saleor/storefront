import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { executeGraphQL } from "@/lib/graphql";
import { CategoriesListDocument } from "@/gql/graphql";
import { Shirt, Laptop, Home, Gift, Watch, Sparkles, ShoppingBag } from "lucide-react";
import { ensureHttps } from "@/lib/utils";

// Icon mapping for categories - can be extended based on category slugs
const categoryIcons: Record<string, { icon: typeof Shirt; color: string }> = {
	apparel: { icon: Shirt, color: "bg-pink-100 text-pink-600" },
	fashion: { icon: Shirt, color: "bg-pink-100 text-pink-600" },
	clothing: { icon: Shirt, color: "bg-pink-100 text-pink-600" },
	electronics: { icon: Laptop, color: "bg-blue-100 text-blue-600" },
	"home-living": { icon: Home, color: "bg-amber-100 text-amber-600" },
	home: { icon: Home, color: "bg-amber-100 text-amber-600" },
	furniture: { icon: Home, color: "bg-amber-100 text-amber-600" },
	accessories: { icon: Watch, color: "bg-purple-100 text-purple-600" },
	jewelry: { icon: Watch, color: "bg-purple-100 text-purple-600" },
	gifts: { icon: Gift, color: "bg-red-100 text-red-600" },
	beauty: { icon: Sparkles, color: "bg-teal-100 text-teal-600" },
	cosmetics: { icon: Sparkles, color: "bg-teal-100 text-teal-600" },
};

const defaultIcon = { icon: ShoppingBag, color: "bg-gray-100 text-gray-600" };

function getIconForCategory(slug: string) {
	// Try exact match first
	if (categoryIcons[slug]) {
		return categoryIcons[slug];
	}
	// Try partial match
	for (const [key, value] of Object.entries(categoryIcons)) {
		if (slug.toLowerCase().includes(key) || key.includes(slug.toLowerCase())) {
			return value;
		}
	}
	return defaultIcon;
}

export async function CategoryGrid() {
	let categoryList: Array<{
		id: string;
		name: string;
		slug: string;
		backgroundImage?: { url: string; alt?: string | null } | null;
		children?: { edges: Array<{ node: { id: string } }> } | null;
	}> = [];

	try {
		const { categories } = await executeGraphQL(CategoriesListDocument, {
			variables: {
				first: 6,
			},
			revalidate: 3600, // Cache for 1 hour
		});
		categoryList = categories?.edges.map(({ node }) => node) || [];
	} catch (error) {
		console.error("Failed to fetch categories:", error);
		return null;
	}

	if (categoryList.length === 0) {
		return null;
	}

	return (
		<section className="bg-secondary-50 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-12 text-center">
					<h2 className="text-2xl font-bold text-secondary-900">Shop by Category</h2>
					<p className="mt-2 text-secondary-600">Find exactly what you&apos;re looking for</p>
				</div>

				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
					{categoryList.map((category) => {
						const { icon: Icon, color } = getIconForCategory(category.slug);
						const childCount = category.children?.edges.length || 0;

						return (
							<LinkWithChannel
								key={category.id}
								href={`/categories/${category.slug}`}
								className="group flex flex-col items-center rounded-xl border border-secondary-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-lg"
							>
								{category.backgroundImage?.url ? (
									<div className="mb-4 h-16 w-16 overflow-hidden rounded-full transition-transform group-hover:scale-110">
										<img
											src={ensureHttps(category.backgroundImage.url)}
											alt={category.backgroundImage.alt || category.name}
											className="h-full w-full object-cover"
										/>
									</div>
								) : (
									<div
										className={`rounded-full p-4 ${color} mb-4 transition-transform group-hover:scale-110`}
									>
										<Icon className="h-6 w-6" />
									</div>
								)}
								<h3 className="text-center font-semibold text-secondary-900 transition-colors group-hover:text-primary-600">
									{category.name}
								</h3>
								{childCount > 0 && (
									<p className="mt-1 text-xs text-secondary-500">{childCount} subcategories</p>
								)}
							</LinkWithChannel>
						);
					})}
				</div>
			</div>
		</section>
	);
}
