import clsx from "clsx";
import Link from "next/link";
import { HTMLAttributes } from "react";

import { getLinkPath } from "@/lib/menus";
import { usePaths } from "@/lib/paths";
import { useFooterMenuQuery } from "@/saleor/api";

import { ChannelDropdown } from "../regionDropdowns/ChannelDropdown";
import { LocaleDropdown } from "../regionDropdowns/LocaleDropdown";
import { useRegions } from "../RegionsProvider";
import styles from "./Footer.module.css";
import { STOREFRONT_NAME } from "@/lib/const";
import { NavLink } from "../NavLink";
import Logo from "../Navbar/Logo";

export type FooterProps = HTMLAttributes<HTMLElement>;

// Saleor Cloud currently doesn't support relative URLs in the footer.
// This is a workaround to make the links work.
// @todo remove this when the issue is fixed.
// const fixMenuItemLocalhostUrl = (url: string) => url.replace(/^https?:\/\/localhost:8000\//, "/");

export function Footer({ className, ...rest }: FooterProps) {
  const shopName = STOREFRONT_NAME;
  const paths = usePaths();
  const { query, currentChannel, currentLocale } = useRegions();

  const { data, error } = useFooterMenuQuery({ variables: { ...query } });

  if (error) {
    console.error("Footer component error", error.message);
  }

  const menu = data?.menu?.items || [];

  return (
    <footer className={clsx(styles.footer, className)} {...rest}>
      <div className="flex mb-14 sm:mb-10">
        <Link href={paths.$baseurl()} passHref legacyBehavior>
          <a href="pass" className="hidden sm:inline-block">
            <div className="mt-px group block h-16 w-28 relative">
              <Logo height="120" width="150" />
            </div>
          </a>
        </Link>
        <div className="grid grid-cols-2 gap-[2rem] w-full sm:w-auto sm:flex sm:flex-wrap sm:justify-end sm:ml-auto">
          {menu.map((item) => (
            <div className="sm:ml-14" key={item?.id}>
              {item?.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles["menu-heading"]}
                >
                  {item?.name}
                </a>
              ) : (
                <Link
                  href={getLinkPath(item, currentChannel.slug, currentLocale)}
                  passHref
                  legacyBehavior
                >
                  <a href="pass" className={styles["menu-heading"]}>
                    {item?.name}
                  </a>
                </Link>
              )}
              <ul className={styles.menu}>
                {shopName === "FASHION4YOU"
                  ? item.name === "Kategorie"
                    ? item?.children?.slice(0, -1).map((subItem) => (
                        <li key={subItem?.id}>
                          <NavLink
                            item={subItem}
                            className={styles["menu-link"]}
                            data-testid={`footerInternalLinks${subItem?.name}`}
                          />
                        </li>
                      ))
                    : item.name === "Kolekcje"
                    ? item?.children?.map((subItem) =>
                        subItem.name.includes("c4u") ? null : (
                          <li key={subItem?.id}>
                            <NavLink
                              item={subItem}
                              className={styles["menu-link"]}
                              data-testid={`footerInternalLinks${subItem?.name}`}
                            />
                          </li>
                        )
                      )
                    : item?.children?.map((subItem) => (
                        <li key={subItem?.id}>
                          <NavLink
                            item={subItem}
                            className={styles["menu-link"]}
                            data-testid={`footerInternalLinks${subItem?.name}`}
                          />
                        </li>
                      ))
                  : shopName === "CLOTHES4U"
                  ? item.name === "Kategorie"
                    ? item?.children?.map((subItem) => (
                        <li key={subItem?.id}>
                          <NavLink
                            item={subItem}
                            className={styles["menu-link"]}
                            data-testid={`footerInternalLinks${subItem?.name}`}
                          />
                        </li>
                      ))
                    : item.name === "Kolekcje"
                    ? item?.children?.map((subItem) =>
                        subItem.name === "Polecane produkty" ? null : (
                          <li key={subItem?.id}>
                            <NavLink
                              item={subItem}
                              className={styles["menu-link"]}
                              data-testid={`footerInternalLinks${subItem?.name}`}
                            />
                          </li>
                        )
                      )
                    : item?.children?.map((subItem) => (
                        <li key={subItem?.id}>
                          <NavLink
                            item={subItem}
                            className={styles["menu-link"]}
                            data-testid={`footerInternalLinks${subItem?.name}`}
                          />
                        </li>
                      ))
                  : item?.children?.map((subItem) => (
                      <p key={subItem.id}>
                        <li key={subItem?.id}>
                          <NavLink
                            item={subItem}
                            className={styles["menu-link"]}
                            data-testid={`footerInternalLinks${subItem?.name}`}
                          />
                        </li>
                      </p>
                    ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <p className="text-sm text-main-3 flex-grow">
          © Copyright 2022 - {new Date().getFullYear()} {STOREFRONT_NAME}
        </p>
        <div className="invisible md:visible flex gap-4 hidden">
          <ChannelDropdown horizontalAlignment="right" />
          <LocaleDropdown horizontalAlignment="right" />
        </div>
      </div>
    </footer>
  );
}
