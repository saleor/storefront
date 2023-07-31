import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { ProductDetailsFragment } from "@/saleor/api";

interface WishlistItem extends ProductDetailsFragment {}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  wishlistCounter: number;
}

interface WishlistProviderProps {
  children: ReactNode;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>("wishlist", []);

  const addToWishlist = (item: WishlistItem) => {
    const existingItem = wishlist.find((wishItem) => wishItem.id === item.id);
    if (!existingItem) {
      setWishlist((prevWishlist) => {
        const updatedWishlist = [...prevWishlist, item];
        return updatedWishlist;
      });
    } else {
      console.log("Item already exists in the wishlist!");
    }
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== itemId));
  };

  const [wishlistCounter, setWishlistCounter] = useState<number>(0);

  useEffect(() => {
    setWishlistCounter(wishlist.length);
  }, [wishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistCounter,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
