import React from "react";

import { useMainMenuQuery } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";
import { STOREFRONT_NAME } from "@/lib/const";

export type MenuItem = {
  name: string;
};

export function Menu() {
  const { query } = useRegions();

  const { error, data } = useMainMenuQuery({
    variables: { ...query },
  });

  if (error) {
    console.error("Navbar/Menu component error", error.message);
  }

  const menuItems = data?.menu?.items || [];

  const maxMenuItems = 5;
  const slicedMenuItems = menuItems.slice(0, maxMenuItems);

  const isExcludedCategory = (item: MenuItem): boolean =>
    item.name === "Mix" || item.name === "Hurt" || item.name === "Detal";

  const visibleCategoryOnMenu =
    STOREFRONT_NAME === "FASHION4YOU"
      ? menuItems.filter((item) => !isExcludedCategory(item))
      : slicedMenuItems;

  return (
    <nav className={styles.nav}>
      <ol>
        {visibleCategoryOnMenu.map((item) => {
          if (item.name === "Aktualności" || item.name === "News") {
            return (
              <li key={item.id}>
                <DropdownMenu menuItem={item} isNews />
              </li>
            );
          } else {
            return (
              <li key={item?.id}>
                <DropdownMenu menuItem={item} />
              </li>
            );
          }
        })}
      </ol>
    </nav>
  );
}

export default Menu;
