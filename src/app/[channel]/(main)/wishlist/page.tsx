"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { ProductList } from "@/ui/components/ProductList";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { Button } from "@/ui/atoms/Button";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export default function WishlistPage() {
	const { items, clearWishlist } = useWishlistStore();

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
			{/* Breadcrumb */}
			<Breadcrumb 
				items={[{ label: "Wishlist" }]} 
				className="mb-6"
			/>

			{/* Page Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-secondary-900">My Wishlist</h1>
					<p className="mt-2 text-secondary-600">
						{items.length} {items.length === 1 ? "item" : "items"} saved
					</p>
				</div>
				{items.length > 0 && (
					<button
						onClick={clearWishlist}
						className="flex items-center gap-2 text-sm text-secondary-500 hover:text-red-600 transition-colors"
					>
						<Trash2 className="h-4 w-4" />
						Clear all
					</button>
				)}
			</div>

			{/* Wishlist Content */}
			{items.length === 0 ? (
				<div className="text-center py-16">
					<div className="mx-auto w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
						<Heart className="h-8 w-8 text-secondary-400" />
					</div>
					<h2 className="text-xl font-semibold text-secondary-900 mb-2">
						Your wishlist is empty
					</h2>
					<p className="text-secondary-600 mb-8 max-w-md mx-auto">
						Save items you love by clicking the heart icon on any product. They&apos;ll appear here for easy access later.
					</p>
					<LinkWithChannel href="/products">
						<Button variant="primary" size="lg">
							<ShoppingBag className="h-5 w-5 mr-2" />
							Start Shopping
						</Button>
					</LinkWithChannel>
				</div>
			) : (
				<>
					<ProductList 
						products={items} 
						variant="grid"
						columns={4}
						showWishlist={true}
					/>
					
					{/* Continue Shopping */}
					<div className="mt-12 text-center">
						<LinkWithChannel href="/products">
							<Button variant="secondary">
								Continue Shopping
							</Button>
						</LinkWithChannel>
					</div>
				</>
			)}
		</section>
	);
}
