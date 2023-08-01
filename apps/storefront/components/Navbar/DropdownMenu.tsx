import Link from "next/link";

import { getLinkPath } from "@/lib/menus";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { NavigationAnchor } from "../NavigationAnchor/NavigationAnchor";
import styles from "./Navbar.module.css";

interface DropdownProps {
  menuItem: MenuItemWithChildrenFragment;
}

function Dropdown({ menuItem }: DropdownProps) {
  return (
    <div className={styles.dropdown}>
      <NavigationAnchor menuItem={menuItem} className={styles["dropdown-trigger"]} />
      {!!menuItem.children?.length && (
        <div className={styles["dropdown-menu"]}>
          <div className="container">
            <div className="grid grid-cols-7 gap-[2rem] mx-2">
              {menuItem.children?.map((item) => (
                <div key={item?.id}>
                  {item?.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles["dropdown-main"]} whitespace-nowrap`}
                    >
                      {item?.name}
                    </a>
                  ) : (
                    <Link href={getLinkPath(item)} passHref legacyBehavior>
                      <a href="pass" className={`${styles["dropdown-main"]} whitespace-nowrap`}>
                        {item?.name}
                      </a>
                    </Link>
                  )}
                  {!!item?.children?.length && (
                    <ul className={styles["dropdown-ul"]}>
                      {item?.children?.map((sub) => (
                        <li key={sub?.id}>
                          <Link href={getLinkPath(sub)} passHref legacyBehavior>
                            <a href="pass" className={styles["dropdown-link"]}>
                              {sub?.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
