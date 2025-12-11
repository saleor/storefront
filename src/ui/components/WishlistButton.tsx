"use client";

import { Heart } from "lucide-react";
import { clsx } from "clsx";
import { useWishlistStore } from "@/store/wishlist";
import type { ProductListItemFragment } from "@/gql/graphql";

interface WishlistButtonProps {
	product: ProductListItemFragment;
	variant?: "icon" | "button";
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function WishlistButton({ 
	product, 
	variant = "icon", 
	size = "md",
	className 
}: WishlistButtonProps) {
	const { toggleItem, isInWishlist } = useWishlistStore();
	const isWishlisted = isInWishlist(product.id);

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleItem(product);
	};

	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	if (variant === "button") {
		return (
			<button
				type="button"
				onClick={handleClick}
				className={clsx(
					"inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors",
					isWishlisted
						? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
						: "border-secondary-300 bg-white text-secondary-700 hover:border-primary-400 hover:bg-primary-50",
					className
				)}
				aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
			>
				<Heart 
					className={clsx(sizeClasses[size], isWishlisted && "fill-current")} 
				/>
				<span className="text-sm font-medium">
					{isWishlisted ? "Saved" : "Save"}
				</span>
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={handleClick}
			className={clsx(
				"p-2 rounded-full transition-colors",
				isWishlisted
					? "bg-red-50 text-red-500 hover:bg-red-100"
					: "bg-white text-secondary-500 hover:bg-secondary-50 hover:text-red-500",
				"shadow-md",
				className
			)}
			aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
		>
			<Heart 
				className={clsx(sizeClasses[size], isWishlisted && "fill-current")} 
			/>
		</button>
	);
}
