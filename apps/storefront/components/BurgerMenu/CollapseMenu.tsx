import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import { getLinkPath } from "@/lib/menus";
import { translate } from "@/lib/translations";
import { MenuItemWithChildrenFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";
import styles from "./BurgerMenu.module.css";
import SubCollapseMenu from "./SubCollapseMenu";

export interface CollapseMenuProps {
  data: MenuItemWithChildrenFragment;
}

function CollapseMenu({ data }: CollapseMenuProps) {
  const [open, setOpen] = useState(false);

  const {
    currentChannel: { slug },
    currentLocale,
  } = useRegions();

  const anchor = data.url ? (
    <a href={data.url} target="_blank" rel="noreferrer" className={styles["collapse-main"]}>
      {translate(data, "name")}
    </a>
  ) : (
    <Link href={getLinkPath(data!, slug, currentLocale)} passHref>
      <a href="pass" className={styles["collapse-main"]}>
        {translate(data, "name")}
      </a>
    </Link>
  );

  return (
    <div className={styles.collapse}>
      {!data?.children?.length ? (
        anchor
      ) : (
        <>
          <button
            type="button"
            className={clsx(styles["collapse-main"], {
              [styles["collapse-main--active"]]: open,
            })}
            onClick={() => setOpen(!open)}
          >
            {translate(data, "name")}
          </button>
          {open && (
            <div>
              {data.children.map((item) => (
                <SubCollapseMenu data={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CollapseMenu;
