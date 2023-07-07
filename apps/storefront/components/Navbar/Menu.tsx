import React from "react";

import { useMainMenuQuery } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";
import { STOREFRONT_NAME } from "@/lib/const";

export function Menu() {
  const { query } = useRegions();

  const { error, data } = useMainMenuQuery({
    variables: { ...query },
  });

  if (error) {
    console.error("Navbar/Menu component error", error.message);
  }

  const menuItems = data?.menu?.items || [];

  const visibleCategoryOnMenu =
    STOREFRONT_NAME === "FASHION4YOU" ? menuItems.slice(0, -2) : menuItems.slice(0, -1);

  return (
    <nav className={styles.nav}>
      <ol>
        {visibleCategoryOnMenu.map((item) => (
          <li key={item?.id}>
            <DropdownMenu key={item?.id} menuItem={item} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Menu;
