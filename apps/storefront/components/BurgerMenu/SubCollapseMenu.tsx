import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";

import { NavigationAnchor } from "../NavigationAnchor";
import { useRegions } from "../RegionsProvider";
import styles from "./BurgerMenu.module.css";
import ChevronDown from "./chevronDownIcon.svg"; // in the final version it should be imported from ui-kit package
import { CollapseMenuProps } from "./CollapseMenu";

function SubCollapseMenu({ menuItem }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);
  const { currentChannel, currentLocale } = useRegions();

  const shouldDisplayAnchor = !menuItem.children?.length;

  return (
    <div className="mt-4">
      {shouldDisplayAnchor ? (
        <NavigationAnchor menuItem={menuItem} className={styles["collapse-sub"]} />
      ) : (
        <>
          <button
            type="button"
            className={clsx(styles["collapse-sub"], {
              [styles["collapse-sub--active"]]: open,
            })}
            onClick={() => setOpen(!open)}
          >
            {translate(menuItem, "name")}
            <ChevronDown />
          </button>
          {open && (
            <div>
              {menuItem.children?.map((sub) => (
                <li key={sub.id} className={styles["menu-link"]}>
                  {sub.url ? (
                    <a href={sub.url} target="_blank" rel="noreferrer">
                      {sub.name}
                    </a>
                  ) : (
                    <Link
                      href={getLinkPath(sub, currentChannel.slug, currentLocale)}
                      passHref
                      legacyBehavior
                    >
                      <a href="pass">{sub.name}</a>
                    </Link>
                  )}
                </li>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubCollapseMenu;
