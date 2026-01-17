"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CartContextType {
	isOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);
	const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

	return (
		<CartContext.Provider
			value={{
				isOpen,
				openCart,
				closeCart,
				toggleCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
