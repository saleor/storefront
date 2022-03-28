import clsx from "clsx";
import Link from "next/link";
import React from "react";

import { translate } from "@/lib/translations";
import { notNullable } from "@/lib/util";
import { MenuItemFragment, useMainMenuQuery } from "@/saleor/api";

import { usePaths } from "../../lib/paths";
import { HamburgerButton } from "../HamburgerButton";
import { useRegions } from "../RegionsProvider";

export function MainMenu() {
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
    <div className="group relative justify-center flex flex-col">
      <HamburgerButton active={openDropdown} onClick={(ev) => onClickButton(ev)} />
      <div
        className={clsx(
          "z-40 dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95",
          openDropdown && "visible",
          !openDropdown && "invisible opacity-0"
        )}
      >
        <div className="mt-5 mr-2 -ml-2 md:mx-3 z-40 absolute h-screen w-screen lg:max-w-7xl md:h-56 bg-white border border-gray-200 rounded-md shadow-lg outline-none">
          <div className="flex flex-col md:flex-row cursor-default md:divide-x md:divide-gray-200">
            {menu?.map((item) => {
              if (!item) {
                return null;
              }
              return (
                <div key={item?.id} className="h-32 md:pl-10 ml-5 md:ml-16 mt-10">
                  <h2 className="font-semibold text-md">{translate(item, "name")}</h2>
                  <ul className="mt-3 absolute">
                    {item?.children?.map((child) => {
                      if (!notNullable(child)) {
                        return null;
                      }
                      return (
                        <li key={child.id}>
                          <Link href={menuLink(child)} passHref>
                            <a
                              onClick={() => setOpenDropdown(false)}
                              href="pass"
                              role="menuitem"
                              className="ml-3 text-black hover:font-semibold hover:text-black"
                            >
                              {translate(child, "name")}
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
