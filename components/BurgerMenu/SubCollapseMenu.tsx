import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";

import { useRegions } from "../RegionsProvider";
import styles from "./BurgerMenu.module.css";
import ChevronDown from "./chevronDownIcon.svg"; // in the final version it should be imported from ui-kit package
import { CollapseMenuProps } from "./CollapseMenu";

function SubCollapseMenu({ data }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);
  const { currentChannel, currentLocale } = useRegions();

  const anchor = data.url ? (
    <a href={data.url} target="_blank" rel="noreferrer" className={styles["collapse-sub"]}>
      {translate(data, "name")}
    </a>
  ) : (
    <Link href={getLinkPath(data, currentChannel.slug, currentLocale)} passHref>
      <a href="pass" className={styles["collapse-sub"]}>
        {translate(data, "name")}
      </a>
    </Link>
  );

  return (
    <div className="mt-4">
      {!data?.children?.length ? (
        anchor
      ) : (
        <>
          <button
            type="button"
            className={clsx(styles["collapse-sub"], {
              [styles["collapse-sub--active"]]: open,
            })}
            onClick={() => setOpen(!open)}
          >
            {translate(data, "name")}
            <ChevronDown />
          </button>
          {open && (
            <div>
              {data?.children?.map((sub) => (
                <li key={sub.id} className={styles["menu-link"]}>
                  {sub.url ? (
                    <a href={sub.url} target="_blank" rel="noreferrer">
                      {sub.name}
                    </a>
                  ) : (
                    <Link href={getLinkPath(sub, currentChannel.slug, currentLocale)} passHref>
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
