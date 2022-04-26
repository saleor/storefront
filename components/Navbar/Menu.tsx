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
    console.error("Navigation component error", error.message);
  }

  const menu = data?.menu?.items || [];

  return (
    <nav className={styles.nav}>
      <ol>
        {menu?.map((item) => {
          if (!item) {
            return null;
          }
          return (
            <li key={item?.id}>
              <DropdownMenu key={item?.id} data={item} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Menu;
