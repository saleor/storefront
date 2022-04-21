import React from "react";

import { translate } from "@/lib/translations";
import { MenuItemFragment, useMainMenuQuery } from "@/saleor/api";

import { usePaths } from "../../lib/paths";
import { HamburgerButton } from "../HamburgerButton";
import { useRegions } from "../RegionsProvider";
import DropdownMenu from "./DropdownMenu";
import styles from "./Navbar.module.css";

export function Menu() {
  const paths = usePaths();
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
    return null;
  }

  const menu = data?.menu?.items || [];

  const menuLink = (item: MenuItemFragment) => {
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
    <nav className={styles.nav}>
      <ol>
        {menu?.map((item) => {
          if (!item) {
            return null;
          }
          return (
            <li>
              <DropdownMenu
                key={item?.id}
                main={{ label: translate(item, "name"), url: menuLink(item) }}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Menu;
