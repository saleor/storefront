import React from "react";

import { useMainMenuQuery } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";
import { STOREFRONT_NAME } from "@/lib/const";

export type MenuItem = {
  id: string;
  name: string;
};

const MAX_MENU_ITEMS = 5;
const EXCLUDED_CATEGORIES = ["Mix", "Hurt", "Detal"];

const isExcludedCategory = (item: MenuItem) => EXCLUDED_CATEGORIES.includes(item.name);

export function Menu() {
  const { query } = useRegions();
  const { error, data } = useMainMenuQuery({ variables: query });

  if (error) {
    console.error("Navbar/Menu component error", error.message);
    return null;
  }

  const menuItems = data?.menu?.items;

  const visibleMenuItems =
    STOREFRONT_NAME === "FASHION4YOU"
      ? menuItems?.filter((item) => !isExcludedCategory(item))
      : menuItems?.slice(0, MAX_MENU_ITEMS);

  return (
    <nav className={styles.nav}>
      <ol>
        {visibleMenuItems?.map((item) => {
          const isNewsItem = ["Aktualności", "News"].includes(item.name);
          return (
            <li key={item.id}>
              <DropdownMenu menuItem={item} isNews={isNewsItem} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Menu;
