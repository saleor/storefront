import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { CheckoutLineDetailsFragment } from "@/saleor/api";

import { BurgerMenu } from "../BurgerMenu";
import { Menu } from "./Menu";
import styles from "./Navbar.module.css";
import NavIconButton from "./NavIconButton";
import UserMenu from "./UserMenu";
import { invariant } from "@apollo/client/utilities/globals";
import { useUser } from "@/lib/useUser";
import Logo from "./Logo";
import { useWishlist } from "context/WishlistContext";

export function Navbar() {
  const paths = usePaths();
  const router = useRouter();

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { authenticated: actuallyAuthenticated } = useUser();
  const { checkout } = useCheckout();

  const { wishlistCounter } = useWishlist();

  // Avoid hydration warning by setting authenticated state in useEffect
  useEffect(() => {
    setAuthenticated(actuallyAuthenticated);
  }, [actuallyAuthenticated]);

  const saleorApiUrl = process.env.NEXT_PUBLIC_API_URI;
  invariant(saleorApiUrl, "Missing NEXT_PUBLIC_API_URI");

  useEffect(() => {
    const handleSizeChange = (e: UIEvent) => {
      if (e.target instanceof HTMLElement) {
        console.log(e.target.getBoundingClientRect().width);
        setIsBurgerOpen(false);
      }
    };

    window.addEventListener("resize", handleSizeChange);
  }, []);

  const counter =
    checkout?.lines?.reduce(
      (amount: number, line?: CheckoutLineDetailsFragment | null) =>
        line ? amount + line.quantity : amount,
      0
    ) || 0;

  return (
    <>
      <div className="hidden xs:block py-4 px-8">
        <Link href={paths.$url()} passHref legacyBehavior>
          <a href="pass" className={styles.logo}>
            <Logo height="89" width="100%" />
          </a>
        </Link>
      </div>
      <div className={clsx(styles.navbar)}>
        <div className={clsx(styles.inner)}>
          <NavIconButton
            icon="menu"
            className="ml-2 lg:hidden "
            onClick={() => setIsBurgerOpen(true)}
          />
          <div className="flex-1 h-full hidden xs:flex">
            <Menu />
          </div>
          <div className="flex-1 flex xs:justify-center"></div>
          <div className="flex-1 flex justify-end">
            {!authenticated ? (
              <Link href={paths.account.login.$url()} passHref legacyBehavior>
                <a href="pass" data-testid="userIcon" className="hidden xs:flex">
                  <NavIconButton isButton={false} icon="user" aria-hidden="true" />
                </a>
              </Link>
            ) : (
              <UserMenu />
            )}
            <Link href={paths.cart.$url()} className="ml-2" data-testid="cartIcon">
              <NavIconButton isButton={false} icon="bag" aria-hidden="true" counter={counter} />
            </Link>
            <Link href={paths.wishlist.$url()} className="ml-2 " data-testid="wishlistIcon">
              <NavIconButton
                isButton={false}
                icon="heart"
                aria-hidden="true"
                counter={wishlistCounter} // Display wishlistCounter as the counter value
              />
            </Link>
            <Link href={paths.search.$url()} passHref legacyBehavior>
              <a href="pass" className="ml-2" data-testid="searchIcon">
                <NavIconButton isButton={false} icon="spyglass" />
              </a>
            </Link>
          </div>
        </div>
      </div>
      <BurgerMenu open={isBurgerOpen} onCloseClick={() => setIsBurgerOpen(false)} />
    </>
  );
}

export default Navbar;
