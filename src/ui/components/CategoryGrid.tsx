import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { executeGraphQL } from "@/lib/graphql";
import { CategoriesListDocument } from "@/gql/graphql";
import { Shirt, Laptop, Home, Gift, Watch, Sparkles, ShoppingBag } from "lucide-react";

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

interface CategoryGridProps {
	channel: string;
}

export async function CategoryGrid({ channel }: CategoryGridProps) {
	const { categories } = await executeGraphQL(CategoriesListDocument, {
		variables: {
			first: 6,
			channel,
		},
		revalidate: 3600, // Cache for 1 hour
	});

	const categoryList = categories?.edges.map(({ node }) => node) || [];

	if (categoryList.length === 0) {
		return null;
	}

	return (
		<section className="bg-secondary-50 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-2xl font-bold text-secondary-900">Shop by Category</h2>
					<p className="mt-2 text-secondary-600">Find exactly what you&apos;re looking for</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{categoryList.map((category) => {
						const { icon: Icon, color } = getIconForCategory(category.slug);
						const childCount = category.children?.edges.length || 0;
						
						return (
							<LinkWithChannel
								key={category.id}
								href={`/categories/${category.slug}`}
								className="group flex flex-col items-center p-6 bg-white rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all"
							>
								{category.backgroundImage?.url ? (
									<div className="w-16 h-16 rounded-full overflow-hidden mb-4 group-hover:scale-110 transition-transform">
										<img 
											src={category.backgroundImage.url} 
											alt={category.backgroundImage.alt || category.name}
											className="w-full h-full object-cover"
										/>
									</div>
								) : (
									<div className={`p-4 rounded-full ${color} mb-4 group-hover:scale-110 transition-transform`}>
										<Icon className="h-6 w-6" />
									</div>
								)}
								<h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors text-center">
									{category.name}
								</h3>
								{childCount > 0 && (
									<p className="text-xs text-secondary-500 mt-1">
										{childCount} subcategories
									</p>
								)}
							</LinkWithChannel>
						);
					})}
				</div>
			</div>
		</section>
	);
}
