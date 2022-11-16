import { useAuthState } from "@saleor/sdk";
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
import Stamp from "./Stamp";
import UserMenu from "./UserMenu";
import { useRegions } from "@/components/RegionsProvider";
import { invariant } from "@apollo/client/utilities/globals";

export function Navbar() {
  const paths = usePaths();
  const router = useRouter();

  const [isBurgerOpen, setBurgerOpen] = useState(false);
  const { authenticated } = useAuthState();
  const { checkout } = useCheckout();
  const { currentLocale, currentChannel } = useRegions();

  const saleorApiUrl = process.env.NEXT_PUBLIC_API_URI;
  invariant(saleorApiUrl, "Missing NEXT_PUBLIC_API_URI");
  const domain = new URL(saleorApiUrl).hostname;

  const checkoutParams = checkout
    ? new URLSearchParams({
        checkout: checkout.id,
        locale: currentLocale,
        channel: currentChannel.slug,
        saleorApiUrl,
        // @todo remove `domain`
        // https://github.com/saleor/saleor-dashboard/issues/2387
        // https://github.com/saleor/saleor-app-sdk/issues/87
        domain,
      })
    : new URLSearchParams();

  const externalCheckoutUrl = checkout ? `/checkout/?${checkoutParams.toString()}` : "#";

  useEffect(() => {
    // Close side menu after changing the page
    router.events.on("routeChangeStart", () => {
      if (isBurgerOpen) {
        setBurgerOpen(false);
      }
    });
  });

  const counter =
    checkout?.lines?.reduce(
      (amount: number, line?: CheckoutLineDetailsFragment | null) =>
        line ? amount + line.quantity : amount,
      0
    ) || 0;

  return (
    <>
      <div className={clsx(styles.navbar)}>
        <div className={clsx(styles.inner)}>
          <div className="flex-1 h-full hidden xs:flex">
            <Menu />
          </div>
          <div className="flex-1 flex xs:justify-center">
            <Link href={paths.$url()} passHref legacyBehavior>
              <a href="pass" className={styles.logo}>
                <Stamp />
              </a>
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            {!authenticated ? (
              <Link href={paths.account.login.$url()} passHref legacyBehavior>
                <a href="pass" data-testid="userIcon">
                  <NavIconButton isButton={false} icon="user" aria-hidden="true" />
                </a>
              </Link>
            ) : (
              <UserMenu />
            )}
            <Link href={externalCheckoutUrl} className="ml-2 hidden xs:flex" data-testid="cartIcon">
              <NavIconButton isButton={false} icon="bag" aria-hidden="true" counter={counter} />
            </Link>
            <Link href={paths.search.$url()} passHref legacyBehavior>
              <a href="pass" className="hidden lg:flex ml-2" data-testid="searchIcon">
                <NavIconButton isButton={false} icon="spyglass" />
              </a>
            </Link>
            <NavIconButton
              icon="menu"
              className="ml-2 lg:hidden"
              onClick={() => setBurgerOpen(true)}
            />
          </div>
        </div>
      </div>
      <BurgerMenu open={isBurgerOpen} onCloseClick={() => setBurgerOpen(false)} />
    </>
  );
}

export default Navbar;
