import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { ProductCardFragment } from "@/saleor/api";

interface CartContextType {
  cart: ProductCardFragment[];
  addToCart: (item: any) => void;
  removeFromCart: (itemId: string) => void;
  cartCounter: number;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useLocalStorage<ProductCardFragment[]>("cart", []);

  const addToCart = (item: ProductCardFragment) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (!existingItem) {
      setCart((prevCart) => {
        const updatedCart = [...prevCart, item];
        return updatedCart;
      });
    } else {
      console.log("Item already exists in the cart!");
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const [cartCounter, setCartCounter] = useState<number>(0);

  useEffect(() => {
    setCartCounter(cart.length);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        cartCounter,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
