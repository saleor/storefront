"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface CartContextType {
	isOpen: boolean;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
}

const defaultCartContext: CartContextType = {
	isOpen: false,
	openCart: () => {},
	closeCart: () => {},
	toggleCart: () => {},
};

const CartContext = createContext<CartContextType>(defaultCartContext);

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
	return useContext(CartContext);
}
