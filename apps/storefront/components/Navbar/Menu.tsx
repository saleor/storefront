import React from "react";

import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";
import { useMenuItems } from "@/lib/hooks/useMenuItems";

export function Menu() {
  const { menuItems, error } = useMenuItems();

  if (error) {
    console.error("Navbar/Menu component error", error.message);
    return null;
  }

  return (
    <nav className={styles.nav}>
      <ol>
        {menuItems?.map((item) => {
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
