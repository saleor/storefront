"use client";

import { Search, ArrowRight } from "lucide-react";
import { ProductList } from "./ProductList";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { Button } from "../atoms/Button";
import type { ProductListItemFragment } from "@/gql/graphql";

interface SearchEmptyStateProps {
	query: string;
	suggestedProducts?: readonly ProductListItemFragment[];
	channel: string;
}

const searchTips = [
	"Check your spelling and try again",
	"Try using more general terms",
	"Try searching for a related term",
	"Browse our categories to find what you're looking for",
];

const popularSearches = [
	"Shoes",
	"T-Shirts",
	"Dresses",
	"Accessories",
	"Electronics",
	"Home Decor",
];

export function SearchEmptyState({ query, suggestedProducts }: SearchEmptyStateProps) {
	return (
		<div className="py-8">
			{/* Empty State Icon and Message */}
			<div className="text-center mb-12">
				<div className="mx-auto w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
					<Search className="h-8 w-8 text-secondary-400" />
				</div>
				<h2 className="text-xl font-semibold text-secondary-900 mb-2">
					No results found for &quot;{query}&quot;
				</h2>
				<p className="text-secondary-600 max-w-md mx-auto">
					We couldn&apos;t find any products matching your search. Try adjusting your search or browse our suggestions below.
				</p>
			</div>

			{/* Search Tips */}
			<div className="bg-secondary-50 rounded-lg p-6 mb-12">
				<h3 className="text-sm font-semibold text-secondary-900 mb-3">
					Search Tips
				</h3>
				<ul className="space-y-2">
					{searchTips.map((tip, index) => (
						<li key={index} className="flex items-start gap-2 text-sm text-secondary-600">
							<span className="text-primary-500 mt-0.5">•</span>
							{tip}
						</li>
					))}
				</ul>
			</div>

			{/* Popular Searches */}
			<div className="mb-12">
				<h3 className="text-lg font-semibold text-secondary-900 mb-4">
					Popular Searches
				</h3>
				<div className="flex flex-wrap gap-2">
					{popularSearches.map((term) => (
						<LinkWithChannel
							key={term}
							href={`/search?query=${encodeURIComponent(term)}`}
							className="inline-flex items-center px-4 py-2 rounded-full border border-secondary-200 bg-white text-sm text-secondary-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
						>
							{term}
						</LinkWithChannel>
					))}
				</div>
			</div>

			{/* Suggested Products */}
			{suggestedProducts && suggestedProducts.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-secondary-900">
							You Might Like
						</h3>
						<LinkWithChannel
							href="/products"
							className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
						>
							View all products
							<ArrowRight className="h-4 w-4" />
						</LinkWithChannel>
					</div>
					<ProductList 
						products={suggestedProducts} 
						variant="grid"
						columns={4}
						showWishlist={true}
					/>
				</div>
			)}

			{/* Browse Categories CTA */}
			<div className="mt-12 text-center">
				<p className="text-secondary-600 mb-4">
					Still can&apos;t find what you&apos;re looking for?
				</p>
				<LinkWithChannel href="/products">
					<Button variant="primary" size="lg">
						Browse All Products
					</Button>
				</LinkWithChannel>
			</div>
		</div>
	);
}
