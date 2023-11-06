import React from "react";

import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";
import { useVisibleMenuItems } from "@/lib/hooks/useVisibleMenuItems";

export function Menu() {
  const { visibleMenuItems } = useVisibleMenuItems();

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
