import React from "react";

import { useMainMenuQuery } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";

export function Menu() {
  const { query } = useRegions();

  const { error, data } = useMainMenuQuery({
    variables: { ...query },
  });

  if (error) {
    console.error("Navbar/Menu component error", error.message);
  }

  const menuItems = data?.menu?.items || [];

  return (
    <nav className={styles.nav}>
      <ol>
        {menuItems.map((item) => (
          <li key={item?.id}>
            <DropdownMenu key={item?.id} menuItem={item} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Menu;
