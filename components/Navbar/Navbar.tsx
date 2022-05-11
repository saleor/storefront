import { useAuthState } from "@saleor/sdk";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { usePaths } from "@/lib/paths";
import { useCheckout } from "@/lib/providers/CheckoutProvider";
import { CheckoutLineDetailsFragment } from "@/saleor/api";

import { BurgerMenu } from "../BurgerMenu";
import { RegionDialog } from "../RegionDialog";
import { useRegions } from "../RegionsProvider";
import { Menu } from "./Menu";
import styles from "./Navbar.module.css";
import NavIconButton from "./NavIconButton";
import UserMenu from "./UserMenu";

export function Navbar() {
  const paths = usePaths();
  const router = useRouter();

  const [isBurgerOpen, setBurgerOpen] = useState(false);
  const [isRegionDialogOpen, setRegionDialogOpen] = useState(false);
  const { authenticated } = useAuthState();
  const { checkout } = useCheckout();
  const { currentChannel } = useRegions();

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
          <div id="Logo">
            <Link href={paths.$url()} passHref>
              <div className="mt-px group block h-14 w-80 relative cursor-pointer">
                <Image src="/images/logo_blue.png" alt="CSPI logo" layout="fill" />
              </div>
            </Link>
            <h1 className="uppercase font-normal text-base mt-1">
              {process.env.NEXT_PUBLIC_STOREFRONT_NAME || ""}
            </h1>
          </div>
          <div className="h-full hidden xs:flex flex-1 justify-center ">
            <Menu />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              tabIndex={-1}
              className="group -m-2 p-2 flex items-center text-base font-medium hidden"
              onClick={() => setRegionDialogOpen(true)}
            >
              {currentChannel.currencyCode}
            </button>
            {!authenticated ? (
              <Link href={paths.account.login.$url()} passHref>
                <a href="pass">
                  <NavIconButton icon="user" aria-hidden="true" />
                </a>
              </Link>
            ) : (
              <UserMenu />
            )}
            <Link href={paths.cart.$url()} passHref>
              <a href="pass" className="ml-2 hidden xs:flex">
                <NavIconButton icon="bag" aria-hidden="true" counter={counter} />
              </a>
            </Link>
            <Link href={paths.search.$url()} passHref>
              <a href="pass" className="hidden lg:flex ml-2">
                <NavIconButton icon="spyglass" />
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
      <RegionDialog isOpen={isRegionDialogOpen} onClose={() => setRegionDialogOpen(false)} />
      <BurgerMenu open={isBurgerOpen} onCloseClick={() => setBurgerOpen(false)} />
    </>
  );
}

export default Navbar;
