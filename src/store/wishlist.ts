import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductListItemFragment } from "@/gql/graphql";

interface WishlistState {
	items: ProductListItemFragment[];
	addItem: (product: ProductListItemFragment) => void;
	removeItem: (productId: string) => void;
	toggleItem: (product: ProductListItemFragment) => void;
	isInWishlist: (productId: string) => boolean;
	clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
	persist(
		(set, get) => ({
			items: [],
			
			addItem: (product) => {
				const { items } = get();
				if (!items.find((item) => item.id === product.id)) {
					set({ items: [...items, product] });
				}
			},
			
			removeItem: (productId) => {
				set({ items: get().items.filter((item) => item.id !== productId) });
			},
			
			toggleItem: (product) => {
				const { items, addItem, removeItem } = get();
				if (items.find((item) => item.id === product.id)) {
					removeItem(product.id);
				} else {
					addItem(product);
				}
			},
			
			isInWishlist: (productId) => {
				return get().items.some((item) => item.id === productId);
			},
			
			clearWishlist: () => {
				set({ items: [] });
			},
		}),
		{
			name: "luxior-wishlist",
		}
	)
);
