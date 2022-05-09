import Link from "next/link";

import { getLinkPath } from "@/lib/menus";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { NavigationAnchor } from "../NavigationAnchor/NavigationAnchor";
import { useRegions } from "../RegionsProvider";
import styles from "./Navbar.module.css";

interface DropdownProps {
  menuItem: MenuItemWithChildrenFragment;
}

function Dropdown({ menuItem }: DropdownProps) {
  const {
    currentChannel: { slug },
    currentLocale,
  } = useRegions();

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
                      className={styles["dropdown-main"]}
                    >
                      {item?.name}
                    </a>
                  ) : (
                    <Link href={getLinkPath(item!, slug, currentLocale)} passHref>
                      <a href="pass" className={styles["dropdown-main"]}>
                        {item?.name}
                      </a>
                    </Link>
                  )}
                  {!!item?.children?.length && (
                    <ul className={styles["dropdown-ul"]}>
                      {item?.children?.map((sub) => (
                        <li key={sub?.id}>
                          <Link href={getLinkPath(sub!, slug, currentLocale)} passHref>
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
