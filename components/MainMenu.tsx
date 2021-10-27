import React from "react";

import { useMainMenuQuery } from "@/saleor/api";
import { HamburgerButton } from "./HamburgerButton";

import Link from "next/link";
import clsx from "clsx";

export const MainMenu: React.VFC = () => {
  const { loading, error, data } = useMainMenuQuery();
  const [openDropdown, setOpenDropdown] = React.useState<boolean>(false);

  if (loading)
    return (
      <div className="group md:px-8 relative max-w-screen-md flex md:pt-2 md:pl-2 flex-col">
        <HamburgerButton onClick={(ev: MouseEvent) => onClickButton(ev)} />
      </div>
    );

  if (error) return <p>Error : {error.message}</p>;

  const menu = data?.menu?.items || [];

  const onClickButton = (ev: { stopPropagation: () => void }) => {
    ev.stopPropagation();
    setOpenDropdown(!openDropdown);
  };

  return (
    <div className="group relative flex pt-2 flex-col">
      <HamburgerButton
        active={openDropdown}
        onClick={(ev: MouseEvent) => onClickButton(ev)}
      />
      <div
        className={clsx(
          "z-40 dropdown-menu transition-all duration-300 transform origin-top-left -translate-y-2 scale-95",
          openDropdown && "visible",
          !openDropdown && "invisible opacity-0"
        )}
      >
        {/* lg:max-w-7xl */}
        <div className="mt-5 mx-3 z-40 absolute h-screen w-screen lg:max-w-7xl md:h-56 bg-white border border-gray-200 rounded-md shadow-lg outline-none">
          <div className="flex flex-col md:flex-row cursor-default md:divide-x md:divide-gray-200">
            {menu?.map((item) => {
              return (
                <div key={item?.name} className="md:pl-10 ml-5 md:ml-16 mt-10">
                  <h2 className="font-semibold text-md">{item?.name}</h2>
                  <ul className="mt-3">
                    {item?.children?.map((child) => {
                      return (
                        <li
                          key={child?.name}
                          onClick={() => setOpenDropdown(false)}
                        >
                          {!!child?.category && (
                            <Link href={"/category/" + child?.category?.slug}>
                              <a
                                role="menuitem"
                                className="ml-3 text-black hover:font-semibold hover:text-black"
                              >
                                {child?.name}
                              </a>
                            </Link>
                          )}
                          {!!child?.collection && (
                            <Link
                              href={"/collection/" + child?.collection?.slug}
                            >
                              <a
                                role="menuitem"
                                className="ml-3 text-black hover:font-semibold hover:text-black"
                              >
                                {child?.name}
                              </a>
                            </Link>
                          )}
                          {!!child?.page && (
                            <Link href={"/page/" + child?.page?.slug}>
                              <a
                                role="menuitem"
                                className="ml-3 text-black hover:font-semibold hover:text-black"
                              >
                                {child?.name}
                              </a>
                            </Link>
                          )}
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
};
