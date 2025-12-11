import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Shirt, Laptop, Home, Gift, Watch, Sparkles } from "lucide-react";

const categories = [
	{
		name: "Fashion",
		slug: "apparel",
		description: "Trending styles",
		icon: Shirt,
		color: "bg-pink-100 text-pink-600",
	},
	{
		name: "Electronics",
		slug: "electronics",
		description: "Latest gadgets",
		icon: Laptop,
		color: "bg-blue-100 text-blue-600",
	},
	{
		name: "Home & Living",
		slug: "home-living",
		description: "Decor & furniture",
		icon: Home,
		color: "bg-amber-100 text-amber-600",
	},
	{
		name: "Accessories",
		slug: "accessories",
		description: "Complete your look",
		icon: Watch,
		color: "bg-purple-100 text-purple-600",
	},
	{
		name: "Gifts",
		slug: "gifts",
		description: "Perfect presents",
		icon: Gift,
		color: "bg-red-100 text-red-600",
	},
	{
		name: "Beauty",
		slug: "beauty",
		description: "Skincare & makeup",
		icon: Sparkles,
		color: "bg-teal-100 text-teal-600",
	},
];

export function CategoryGrid() {
	return (
		<section className="bg-secondary-50 py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-2xl font-bold text-secondary-900">Shop by Category</h2>
					<p className="mt-2 text-secondary-600">Find exactly what you&apos;re looking for</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
					{categories.map((category) => {
						const Icon = category.icon;
						return (
							<LinkWithChannel
								key={category.slug}
								href={`/categories/${category.slug}`}
								className="group flex flex-col items-center p-6 bg-white rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all"
							>
								<div className={`p-4 rounded-full ${category.color} mb-4 group-hover:scale-110 transition-transform`}>
									<Icon className="h-6 w-6" />
								</div>
								<h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
									{category.name}
								</h3>
								<p className="text-xs text-secondary-500 mt-1">{category.description}</p>
							</LinkWithChannel>
						);
					})}
				</div>
			</div>
		</section>
	);
}
