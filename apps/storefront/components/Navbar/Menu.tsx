import React from "react";

import { useMainMenuQuery } from "@/saleor/api";

import { HamburgerButton } from "../HamburgerButton";
import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";

export function Menu() {
  const { query } = useRegions();

  const { loading, error, data } = useMainMenuQuery({
    variables: { ...query },
  });

  const [openDropdown, setOpenDropdown] = React.useState<boolean>(false);

  const onClickButton = (ev: { stopPropagation: () => void }) => {
    ev.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  if (loading) {
    return (
      <div className="group md:px-8 relative max-w-screen-md flex md:pt-2 md:pl-2 flex-col">
        <HamburgerButton onClick={(ev) => onClickButton(ev)} />
      </div>
    );
  }

  if (error) {
    console.error("Navigation component error", error.message);
  }

  const menu = data?.menu?.items || [];

  return (
    <nav className={styles.nav}>
      <ol>
        {menu?.slice(0, 1).map((item) => {
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
