import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Button } from "../atoms/Button";
import { ArrowRight } from "lucide-react";
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

interface HeroSectionProps {
	channel: string;
}

export async function HeroSection({ channel }: HeroSectionProps) {
	// Fetch product count for stats
	const { products } = await executeGraphQL(ProductListDocument, {
		variables: {
			first: 1,
			channel,
		},
		revalidate: 3600,
	});

	// Format product count for display
	const productCount = products?.edges.length ? "1000+" : "100+";

	return (
		<section className="relative bg-gradient-to-r from-primary-900 to-primary-700 overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-10">
				<svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
					<defs>
						<pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
							<circle cx="10" cy="10" r="1" fill="currentColor" />
						</pattern>
					</defs>
					<rect fill="url(#hero-pattern)" width="100%" height="100%" />
				</svg>
			</div>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="max-w-2xl">
					{/* Badge */}
					<span className="inline-flex items-center rounded-full bg-primary-500/20 px-3 py-1 text-sm font-medium text-primary-100 mb-6">
						✨ New Season Collection
					</span>

					{/* Headline */}
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
						Discover Your
						<span className="block text-primary-200">Perfect Style</span>
					</h1>

					{/* Description */}
					<p className="mt-6 text-lg text-primary-100 max-w-xl">
						Explore our curated collection of premium products. From fashion to electronics, 
						find everything you need with free shipping on orders over $50.
					</p>

					{/* CTAs */}
					<div className="mt-10 flex flex-wrap gap-4">
						<LinkWithChannel href="/products">
							<Button variant="primary" size="lg" className="bg-white text-primary-900 hover:bg-primary-50">
								Shop Now
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
						</LinkWithChannel>
						<LinkWithChannel href="/collections/featured-products">
							<Button variant="ghost" size="lg" className="text-white border-white/30 hover:bg-white/10">
								View Collections
							</Button>
						</LinkWithChannel>
					</div>

					{/* Stats */}
					<div className="mt-12 grid grid-cols-3 gap-8 border-t border-primary-500/30 pt-8">
						<div>
							<p className="text-3xl font-bold text-white">{productCount}</p>
							<p className="text-sm text-primary-200">Products</p>
						</div>
						<div>
							<p className="text-3xl font-bold text-white">24/7</p>
							<p className="text-sm text-primary-200">Support</p>
						</div>
						<div>
							<p className="text-3xl font-bold text-white">Free</p>
							<p className="text-sm text-primary-200">Shipping $50+</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
