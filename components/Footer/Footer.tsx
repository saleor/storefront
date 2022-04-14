import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HTMLAttributes } from "react";

import { usePaths } from "@/lib/paths";
import { MenuItemFragment, useFooterMenuQuery } from "@/saleor/api";

import { Box } from "../Box";
import { useRegions } from "../RegionsProvider";
import styles from "./Footer.module.css";

export type FooterProps = HTMLAttributes<HTMLElement>;

export function Footer({ className, ...rest }: FooterProps) {
  const paths = usePaths();
  const { query } = useRegions();

  const { data, error } = useFooterMenuQuery({ variables: { ...query } });

  if (error) {
    console.error("Footer component error", error.message);
    return null;
  }

  const menu = data?.menu?.items || [];

  const gethLinkPath = (item: MenuItemFragment) => {
    if (item.category) {
      return paths.category._slug(item.category?.slug).$url();
    }
    if (item.collection) {
      return paths.collection._slug(item.collection?.slug).$url();
    }
    if (item.page) {
      return paths.page._slug(item.page?.slug).$url();
    }
    return paths.$url();
  };

  return (
    <footer className={clsx(styles.footer, className)} {...rest}>
      <Box className={styles["footer-inner"]}>
        <div className="flex mb-14 sm:mb-10">
          <Link href={paths.$url()} passHref>
            <a href="pass" className="hidden sm:inline-block">
              <div className="mt-px group block h-16 w-28 relative grayscale">
                <Image src="/saleor.svg" alt="Saleor logo" layout="fill" />
              </div>
            </a>
          </Link>
          <div className="grid grid-cols-2 gap-[2rem] w-full sm:w-auto sm:flex sm:flex-wrap sm:justify-end sm:ml-auto">
            {menu.map((item) => (
              <div className="sm:ml-14" key={item?.id}>
                <Link href={gethLinkPath(item!)} passHref>
                  <a
                    href="pass"
                    className="block text-md font-bold mb-4 cursor-pointer hover:underline"
                  >
                    {item?.name}
                  </a>
                </Link>
                <ul className={styles.menu}>
                  {item?.children?.map((sub) => (
                    <li key={sub?.id}>
                      <Link href={gethLinkPath(sub!)} passHref>
                        <a href="pass" className={styles["menu-link"]}>
                          {sub?.name}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-main-3">
          © Copyright 2018 - {new Date().getFullYear()} Saleor Commerce
        </p>
      </Box>
    </footer>
  );
}

export default Footer;
